export type AboutMetadata = {
  owner: string;
  github: string;
  repoUrl: string;
  version: string;
  license: string;
  localServerUrl: string;
  status: string;
};

export function getAboutMetadata(): AboutMetadata {
  return {
    owner: "Feras Hania",
    github: "ferasbusiness666",
    repoUrl: "https://github.com/ferasbusiness666/Stacksmith",
    version: "0.0.0",
    license: "MIT",
    localServerUrl: "http://127.0.0.1:4317",
    status: "Local MVP",
  };
}
