import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import CommandPalette from './components/layout/CommandPalette';
import AuthModal from './components/modals/AuthModal';
import LogoutModal from './components/modals/LogoutModal';
import LockScreenModal from './components/modals/LockScreenModal';
import ProjectModal from './components/modals/ProjectModal';
import TerminalModal from './components/modals/TerminalModal';

import OverviewTab from './components/tabs/OverviewTab';
import RoadmapTab from './components/tabs/RoadmapTab';
import ProjectsTab from './components/tabs/ProjectsTab';
import ToolkitTab from './components/tabs/ToolkitTab';
import PythonLabTab from './components/tabs/PythonLabTab';
import AiHubTab from './components/tabs/AiHubTab';
import DatabaseTab from './components/tabs/DatabaseTab';
import ToolsDirectoryTab from './components/tabs/ToolsDirectoryTab';
import QuizTab from './components/tabs/QuizTab';
import ProfileTab from './components/tabs/ProfileTab';
import AdhdFocusTab from './components/tabs/AdhdFocusTab';
import AboutTab from './components/tabs/AboutTab';

function MainContent() {
    const { activeTab } = useAuth();

    return (
        <main className="main-content" id="main-content">
            <Header />
            <div className="content-body">
                {activeTab === 'overview' && <OverviewTab />}
                {activeTab === 'roadmap' && <RoadmapTab />}
                {activeTab === 'projects' && <ProjectsTab />}
                {activeTab === 'toolkit' && <ToolkitTab />}
                {activeTab === 'ai-hub' && <AiHubTab />}
                {activeTab === 'python' && <PythonLabTab />}
                {activeTab === 'database' && <DatabaseTab />}
                {activeTab === 'tools' && <ToolsDirectoryTab />}
                {activeTab === 'quiz' && <QuizTab />}
                {activeTab === 'profile' && <ProfileTab />}
                {activeTab === 'adhd' && <AdhdFocusTab />}
                {activeTab === 'about' && <AboutTab />}
            </div>
        </main>
    );
}

export default function App() {
    return (
        <AuthProvider>
            <div className="app-container" style={{ display: 'flex', minHeight: '100vh' }}>
                <Sidebar />
                <MainContent />
                <CommandPalette />
                <AuthModal />
                <LogoutModal />
                <LockScreenModal />
                <ProjectModal />
                <TerminalModal />
            </div>
        </AuthProvider>
    );
}
