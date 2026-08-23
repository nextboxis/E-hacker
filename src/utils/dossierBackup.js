/**
 * Utility to export and restore operative dossiers (.ehk backup files).
 */

export function exportDossier(allProfiles, activeProfile) {
    const payload = {
        version: "3.0.0",
        exportTimestamp: new Date().toISOString(),
        activeProfileId: activeProfile?.id,
        profiles: allProfiles,
        systemTag: "E-HACKER-SEC-BACKUP"
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(payload, null, 2));
    const downloadAnchor = document.createElement('a');
    const filename = `dossier_backup_${activeProfile?.callsign || 'operative'}_${new Date().toISOString().slice(0, 10)}.ehk.json`;
    
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", filename);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
}

export function importDossier(file, onSuccess, onError) {
    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const data = JSON.parse(e.target.result);
            if (!data.profiles || !Array.isArray(data.profiles)) {
                throw new Error("Invalid dossier format: Missing profile definitions.");
            }

            localStorage.setItem('roadmap-multi-profiles', JSON.stringify(data.profiles));
            if (data.activeProfileId) {
                localStorage.setItem('roadmap-active-profile-id', data.activeProfileId);
            }

            if (onSuccess) onSuccess(data);
        } catch (err) {
            if (onError) onError(err.message || "Failed to parse dossier backup file.");
        }
    };
    reader.readAsText(file);
}
