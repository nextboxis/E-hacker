import React from 'react';

export default class TerminalErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error("Terminal Subsystem Exception:", error, errorInfo);
        this.setState({ errorInfo });
    }

    handleRecover = () => {
        this.setState({ hasError: false, error: null, errorInfo: null });
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="terminal-crash-wrapper">
                    <div className="terminal-crash-box">
                        <div className="crash-header">
                            <span className="crash-pulse-dot"></span>
                            <span>KERNEL FAULT // SUBSYSTEM ISOLATED</span>
                        </div>
                        <h2 className="crash-title">RUNTIME EXCEPTION DETECTED</h2>
                        <p className="crash-subtitle">
                            The active module encountered an unhandled exception. Sandbox isolation prevented system-wide crash.
                        </p>

                        <div className="crash-log-stream">
                            <div className="crash-line text-danger">
                                &gt; ERROR: {this.state.error?.toString() || 'Unknown Kernel Exception'}
                            </div>
                            {this.state.errorInfo?.componentStack && (
                                <pre className="crash-stack-trace">
                                    {this.state.errorInfo.componentStack.slice(0, 400)}...
                                </pre>
                            )}
                        </div>

                        <div className="crash-action-row mt-20">
                            <button className="site-btn" onClick={this.handleRecover}>
                                Restart Active Module
                            </button>
                            <button
                                className="site-btn tool-btn secondary-btn"
                                onClick={() => window.location.reload()}
                            >
                                Reboot Workstation
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
