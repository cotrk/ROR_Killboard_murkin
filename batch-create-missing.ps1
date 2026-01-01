# Batch create missing pages from archive
# Files that exist in archive but might be missing in active pages

$missingFiles = @(
    "GuildMemberList",
    "GuildInfo", 
    "CharacterRecentDeaths",
    "CharacterRecentKills"
)

# For each missing file, create a simple modern version
foreach ($file in $missingFiles) {
    Write-Host "Creating $file.tsx..."
    
    # Create basic modern template
    $content = @"
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { ReactElement } from 'react';

export function $file(): ReactElement {
    const { t } = useTranslation(['common', 'pages']);

    return (
        <div className=""container mx-auto max-w-7xl mt-2"">
            <div className=""flex justify-between items-center mb-4"">
                <nav className=""breadcrumbs text-sm"">
                    <ul>
                        <li>
                            <Link to=""/"" className=""link-hover link-primary"">{t('common:home')}</Link>
                        </li>
                        <li className=""text-base-content/60"">
                            $file Component
                        </li>
                    </ul>
                </nav>
            </div>

            <div className=""card bg-base-100 shadow-xl"">
                <div className=""card-body"">
                    <h2 className=""card-title text-2xl mb-4"">$file Component</h2>
                    <div className=""alert alert-info"">
                        <div className=""flex items-center gap-2"">
                            <svg className=""w-6 h-6"" fill=""none"" stroke=""currentColor"" viewBox=""0 0 24 24"">
                                <path strokeLinecap=""round"" strokeLinejoin=""round"" strokeWidth={2} d=""M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"" />
                            </svg>
                            <span>$file component coming soon...</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
"@
    
    # Create the file
    $content | Out-File -FilePath "src\pages\$file.tsx" -Encoding UTF8
    Write-Host "Created $file.tsx"
}

Write-Host "Batch creation complete!"
