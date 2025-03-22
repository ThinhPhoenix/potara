#define MyAppName "Potara"
#define MyAppVersion "1.0.0"
#define MyAppPublisher "ThinhPhoenix"
#define MyAppURL "https://github.com/thinhphoenix/potara-cli"
#define MyAppExeName "potara.exe"

[Setup]
AppId={{D8552654-0D21-4B90-9828-87C4AE7CBF8F}}
AppName={#MyAppName}
SetupIconFile=potara.ico
AppVersion={#MyAppVersion}
AppPublisher={#MyAppPublisher}
AppPublisherURL={#MyAppURL}
AppSupportURL={#MyAppURL}
AppUpdatesURL={#MyAppURL}
DefaultDirName={autopf}\{#MyAppName}
UninstallDisplayIcon={app}\{#MyAppExeName}
ArchitecturesAllowed=x64
ArchitecturesInstallIn64BitMode=x64
Compression=lzma
SolidCompression=yes
OutputBaseFilename=PotaraInstaller
WizardStyle=modern

[Languages]
Name: "english"; MessagesFile: "compiler:Default.isl"

[Tasks]
Name: "desktopicon"; Description: "Create a Desktop Shortcut"; GroupDescription: "Additional Icons"; Flags: unchecked

[Files]
Source: "C:\Users\laith\Desktop\potara-cli\{#MyAppExeName}"; DestDir: "{app}"; Flags: ignoreversion

[Icons]
Name: "{autoprograms}\{#MyAppName}"; Filename: "{app}\{#MyAppExeName}"
Name: "{autodesktop}\{#MyAppName}"; Filename: "{app}\{#MyAppExeName}"; Tasks: desktopicon

[Registry]
Root: HKLM; Subkey: "SYSTEM\CurrentControlSet\Control\Session Manager\Environment"; \
    ValueType: expandsz; ValueName: "Path"; ValueData: "{olddata};{app}"; Flags: preservestringtype; Check: NeedsAddPath

[Code]
const
  WM_SETTINGCHANGE = $1A;

procedure SendMessage(hWnd: Integer; Msg: Integer; wParam: Integer; lParam: Integer);
  external 'SendMessageW@user32.dll stdcall';

function NeedsAddPath: Boolean;
var
  CurrentPath: string;
begin
  if not RegQueryStringValue(HKLM, 'SYSTEM\CurrentControlSet\Control\Session Manager\Environment', 'Path', CurrentPath) then
  begin
    Result := True;  // Path variable doesn't exist, so add it
    exit;
  end;

  // Ensure the path is not already added
  Result := Pos(';' + ExpandConstant('{app}') + ';', ';' + CurrentPath + ';') = 0;
end;

procedure UpdateEnvironment;
begin
  // Notify Windows that the environment (PATH) has changed
  SendMessage(HWND_BROADCAST, WM_SETTINGCHANGE, 0, 0);
end;

procedure CurStepChanged(CurStep: TSetupStep);
begin
  if CurStep = ssPostInstall then
    UpdateEnvironment;
end;