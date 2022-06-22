const core = require("@actions/core");
const JiraApi = require("jira-client")

let jira, domain, username, password, versionName, versionDescription, versionArchived, issueKey;
(async () => {
    try {
        domain = core.getInput("domain");
        username = core.getInput("username");
        password = core.getInput("password");
        versionName = core.getInput("versionName");
        issueKey = core.getInput("issueKey");
        versionDescription = core.getInput("versionDescription") || "CD Version";
        versionArchived = core.getInput("versionArchived") || true;

        // Initialize
        jira = new JiraApi({
            protocol: "https",
            host: domain,
            username: username,
            password: password,
        });
        //core.setFailed(`version is not correct: [${version}] must be "1.0.0"/"v1.0.0"/"test 1.0.0" pattern`);
        createAndSetVersion(issueKey, versionName, versionDescription, versionArchived)

        // core.setOutput("new-version", nextVersion);
    } catch (error) {
        core.setFailed(error.message);
    }
})();

async function createAndSetVersion(issueKey, versionName, versionDescription, versionArchived) {
    // from e.g. TEST-1 get the project key --> TEST
    const projectKey = getProjectKey(issueKey);
    const projectId = await getProjectId(projectKey);
    const issueId = await getIssueId(issueKey);
    const versionId = await createVersion(projectId, versionName, versionDescription, versionArchived);
    await setVersion(issueId, versionId);
}

function getProjectKey(issueKey) {
    return issueKey.substring(0, issueKey.indexOf("-"));
}

async function getProjectId(projectKey) {
    const project = await jira.getProject(projectKey);
    return project.id
}

async function getIssueId(issueKey) {
    const issue = await jira.findIssue(issueKey);
    return issue.id;
}

async function createVersion(projectId, versionName, versionDescription, versionArchived) {
    const date = new Date().toISOString().substring(0,10);
    let version =  await jira.createVersion({
        description: versionDescription,
        name: versionName,
        archived: versionArchived,
        released: false,
        startDate: date,
        projectId: projectId
    });
    if (!!version.errors) {
        // version exists already
        version = await getVersion(projectId, versionName);
    }
    return version.id;
}

async function getVersion(projectId, versionName) {
    const versions = await jira.getVersions(projectId);
    for (let i = 0; i < versions.length; i++) {
        const version = versions[i];
        if (version.name === versionName) {
            return version;
        }
    }
    return undefined;
}

async function setVersion(issueId, versionId) {
    await jira.updateIssue(issueId, {
        update: {
            fixVersions: [{"add": {id: versionId}}]
        }
    });
}