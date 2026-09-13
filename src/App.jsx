import React, { Suspense, lazy } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './components/auth/LoginPage';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import CommandPalette from './components/layout/CommandPalette';
import TerminalErrorBoundary from './components/common/TerminalErrorBoundary';
import ProjectModal from './components/modals/ProjectModal';
import TerminalModal from './components/modals/TerminalModal';
import LockScreenModal from './components/modals/LockScreenModal';
import LogoutModal from './components/modals/LogoutModal';
import { useIdleTimer } from './hooks/useIdleTimer';

// Lazy-load tabs for optimal performance and chunk-splitting
const OverviewTab = lazy(() => import('./components/tabs/OverviewTab'));
const RoadmapTab = lazy(() => import('./components/tabs/RoadmapTab'));
const ProjectsTab = lazy(() => import('./components/tabs/ProjectsTab'));
const MitreMatrixTab = lazy(() => import('./components/tabs/MitreMatrixTab'));
const ToolkitTab = lazy(() => import('./components/tabs/ToolkitTab'));
const AiHubTab = lazy(() => import('./components/tabs/AiHubTab'));
const SocLogHunterTab = lazy(() => import('./components/tabs/SocLogHunterTab'));
const DatabaseTab = lazy(() => import('./components/tabs/DatabaseTab'));
const ToolsDirectoryTab = lazy(() => import('./components/tabs/ToolsDirectoryTab'));
const QuizTab = lazy(() => import('./components/tabs/QuizTab'));
const ProfileTab = lazy(() => import('./components/tabs/ProfileTab'));

function TabLoader() {
    return (
        <div className="tab-loading-skeleton">
            <div className="tab-skeleton-pulse"></div>
            <div className="tab-skeleton-content">
                <span className="tab-skeleton-tag">INITIALIZING MODULE //</span>
                <p className="tab-skeleton-text">
                    <span className="boot-cursor">&gt;</span> DECRYPTING TAB PAYLOAD & ASSETS...
                </p>
                <div className="tab-skeleton-bar">
                    <div className="tab-skeleton-fill"></div>
                </div>
            </div>
        </div>
    );
}

function MainContent() {
    const { activeTab } = useAuth();

    return (
        <main className="main-content" id="main-content">
            <Header />
            <div className="content-body">
                <TerminalErrorBoundary>
                    <Suspense fallback={<TabLoader />}>
                        {activeTab === 'overview' && <OverviewTab />}
                        {activeTab === 'roadmap' && <RoadmapTab />}
                        {activeTab === 'projects' && <ProjectsTab />}
                        {activeTab === 'mitre' && <MitreMatrixTab />}
                        {activeTab === 'toolkit' && <ToolkitTab />}
                        {activeTab === 'ai-hub' && <AiHubTab />}
                        {activeTab === 'soc-hunter' && <SocLogHunterTab />}
                        {activeTab === 'database' && <DatabaseTab />}
                        {activeTab === 'tools' && <ToolsDirectoryTab />}
                        {activeTab === 'quiz' && <QuizTab />}
                        {activeTab === 'profile' && <ProfileTab />}
                    </Suspense>
                </TerminalErrorBoundary>
            </div>
        </main>
    );
}

function DashboardLayout() {
    useIdleTimer(10); // Auto-locks workstation after 10m of inactivity

    return (
        <div className="app-container" style={{ display: 'flex', minHeight: '100vh' }}>
            <Sidebar />
            <MainContent />
            <CommandPalette />
            <ProjectModal />
            <TerminalModal />
            <LockScreenModal />
            <LogoutModal />
        </div>
    );
}

function AppContent() {
    const { isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        return <LoginPage />;
    }

    return <DashboardLayout />;
}

export default function App() {
    return (
        <AuthProvider>
            <AppContent />
        </AuthProvider>
    );
}
