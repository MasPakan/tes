const EventEmitter = require('events');

class ErrorRecoveryManager extends EventEmitter {
    constructor(options = {}) {
        super();
        this.maxRetries = options.maxRetries || 5;
        this.baseDelay = options.baseDelay || 1000; // 1 second
        this.maxDelay = options.maxDelay || 30000; // 30 seconds
        this.backoffMultiplier = options.backoffMultiplier || 2;
        this.jitter = options.jitter || 0.1; // 10% jitter
        this.retryCount = 0;
        this.isRecovering = false;
        this.recoveryStrategies = new Map();
        this.circuitBreaker = {
            failures: 0,
            lastFailureTime: null,
            state: 'CLOSED', // CLOSED, OPEN, HALF_OPEN
            threshold: options.circuitThreshold || 5,
            timeout: options.circuitTimeout || 60000 // 1 minute
        };
    }

    // Register a recovery strategy for specific error types
    registerStrategy(errorType, strategy) {
        this.recoveryStrategies.set(errorType, strategy);
    }

    // Main error handling method
    async handleError(error, context = {}) {
        const errorType = this.getErrorType(error);
        const strategy = this.recoveryStrategies.get(errorType) || this.getDefaultStrategy();
        
        this.emit('error', { error, context, errorType, retryCount: this.retryCount });
        
        // Check circuit breaker
        if (this.isCircuitOpen()) {
            this.emit('circuitOpen', { error, context });
            throw new Error('Circuit breaker is open');
        }

        // Check if we should retry
        if (this.shouldRetry(error, context)) {
            return await this.retryWithBackoff(error, context, strategy);
        } else {
            this.emit('maxRetriesReached', { error, context, retryCount: this.retryCount });
            throw error;
        }
    }

    // Determine error type for strategy selection
    getErrorType(error) {
        if (error.code === 'ECONNRESET' || error.code === 'ENOTFOUND' || error.code === 'ETIMEDOUT') {
            return 'NETWORK';
        } else if (error.code === 'RATELIMIT') {
            return 'RATELIMIT';
        } else if (error.message.includes('token') || error.message.includes('unauthorized')) {
            return 'AUTH';
        } else if (error.message.includes('permission') || error.message.includes('forbidden')) {
            return 'PERMISSION';
        } else if (error.message.includes('not found') || error.code === 404) {
            return 'NOT_FOUND';
        } else if (error.code === 'ECONNREFUSED') {
            return 'CONNECTION_REFUSED';
        } else {
            return 'UNKNOWN';
        }
    }

    // Default recovery strategy
    getDefaultStrategy() {
        return {
            name: 'default',
            maxRetries: this.maxRetries,
            backoff: true,
            actions: ['wait', 'retry']
        };
    }

    // Check if we should retry based on error type and context
    shouldRetry(error, context) {
        if (this.retryCount >= this.maxRetries) {
            return false;
        }

        const errorType = this.getErrorType(error);
        
        // Don't retry certain error types
        if (['AUTH', 'PERMISSION', 'NOT_FOUND'].includes(errorType)) {
            return false;
        }

        // Check if error is retryable
        if (error.retryable === false) {
            return false;
        }

        return true;
    }

    // Retry with exponential backoff
    async retryWithBackoff(error, context, strategy) {
        this.retryCount++;
        const delay = this.calculateDelay();
        
        this.emit('retry', { 
            error, 
            context, 
            retryCount: this.retryCount, 
            delay,
            strategy: strategy.name 
        });

        // Wait before retry
        await this.sleep(delay);

        try {
            // Execute recovery actions
            await this.executeRecoveryActions(strategy.actions, context);
            
            // Reset retry count on success
            this.retryCount = 0;
            this.resetCircuitBreaker();
            
            this.emit('recoverySuccess', { 
                error, 
                context, 
                retryCount: this.retryCount 
            });
            
            return true;
        } catch (recoveryError) {
            this.recordFailure();
            
            this.emit('recoveryFailed', { 
                originalError: error, 
                recoveryError, 
                context, 
                retryCount: this.retryCount 
            });
            
            // If we haven't reached max retries, try again
            if (this.retryCount < this.maxRetries) {
                return await this.retryWithBackoff(error, context, strategy);
            } else {
                throw recoveryError;
            }
        }
    }

    // Calculate delay with exponential backoff and jitter
    calculateDelay() {
        const exponentialDelay = this.baseDelay * Math.pow(this.backoffMultiplier, this.retryCount - 1);
        const cappedDelay = Math.min(exponentialDelay, this.maxDelay);
        const jitterAmount = cappedDelay * this.jitter * Math.random();
        return Math.floor(cappedDelay + jitterAmount);
    }

    // Execute recovery actions
    async executeRecoveryActions(actions, context) {
        for (const action of actions) {
            switch (action) {
                case 'wait':
                    // Already handled in retryWithBackoff
                    break;
                case 'retry':
                    // Retry logic is handled by the caller
                    break;
                case 'reconnect':
                    if (context.client && typeof context.client.login === 'function') {
                        await context.client.login(context.token);
                    }
                    break;
                case 'refreshToken':
                    // Implement token refresh logic if needed
                    break;
                case 'clearCache':
                    // Clear any cached data
                    break;
                case 'resetConnection':
                    if (context.client && typeof context.client.destroy === 'function') {
                        context.client.destroy();
                        // Recreate client if needed
                    }
                    break;
            }
        }
    }

    // Circuit breaker methods
    isCircuitOpen() {
        if (this.circuitBreaker.state === 'OPEN') {
            const now = Date.now();
            if (now - this.circuitBreaker.lastFailureTime > this.circuitBreaker.timeout) {
                this.circuitBreaker.state = 'HALF_OPEN';
                return false;
            }
            return true;
        }
        return false;
    }

    recordFailure() {
        this.circuitBreaker.failures++;
        this.circuitBreaker.lastFailureTime = Date.now();
        
        if (this.circuitBreaker.failures >= this.circuitBreaker.threshold) {
            this.circuitBreaker.state = 'OPEN';
            this.emit('circuitBreakerOpen', { 
                failures: this.circuitBreaker.failures,
                threshold: this.circuitBreaker.threshold 
            });
        }
    }

    resetCircuitBreaker() {
        this.circuitBreaker.failures = 0;
        this.circuitBreaker.state = 'CLOSED';
        this.retryCount = 0;
    }

    // Utility method for sleep
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Reset recovery state
    reset() {
        this.retryCount = 0;
        this.isRecovering = false;
        this.resetCircuitBreaker();
    }

    // Get recovery status
    getStatus() {
        return {
            retryCount: this.retryCount,
            maxRetries: this.maxRetries,
            isRecovering: this.isRecovering,
            circuitBreaker: { ...this.circuitBreaker },
            strategies: Array.from(this.recoveryStrategies.keys())
        };
    }

    // Create recovery strategies for common Discord errors
    setupDiscordStrategies() {
        // Network errors
        this.registerStrategy('NETWORK', {
            name: 'network_recovery',
            maxRetries: 3,
            backoff: true,
            actions: ['wait', 'retry', 'reconnect']
        });

        // Rate limit errors
        this.registerStrategy('RATELIMIT', {
            name: 'ratelimit_recovery',
            maxRetries: 2,
            backoff: true,
            actions: ['wait', 'retry']
        });

        // Connection refused
        this.registerStrategy('CONNECTION_REFUSED', {
            name: 'connection_recovery',
            maxRetries: 5,
            backoff: true,
            actions: ['wait', 'retry', 'resetConnection', 'reconnect']
        });

        // Authentication errors
        this.registerStrategy('AUTH', {
            name: 'auth_recovery',
            maxRetries: 1,
            backoff: false,
            actions: ['refreshToken', 'reconnect']
        });
    }
}

module.exports = ErrorRecoveryManager;