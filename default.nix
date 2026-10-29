{
  lib,
  stdenv,
  nodejs,
  npmHooks,
  fetchNpmDeps,
  python3,
}:
stdenv.mkDerivation (finalAttrs: {
  pname = "my-website-carbon-badges";
  version = "0.0.1";

  src = ./.;

  npmDeps = fetchNpmDeps {
    src = "${finalAttrs.src}";
    hash = "sha256-QVxdkBXV7J8OF4Y9ut/6DC8YsOfCTd2DsCRJG//7Q+o=";
  };

  npmBuildScript = "build";

  nativeBuildInputs = [
    nodejs
    npmHooks.npmConfigHook
    npmHooks.npmBuildHook
    python3
  ];

  installPhase = ''
    runHook preInstall

    mkdir -p $out
    cp public/*.min.* $out/

    runHook postInstall
  '';

  meta = {
    description = "Hard fork of https://gitlab.com/wholegrain/website-carbon-badges with my customizations";
    license = lib.licenses.gpl3Plus;
  };
})
