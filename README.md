# Jira create and set fix version

This action is intended for Continuous Delivery with Jira Cloud.
The action will set the "fix version" in Jira to the given version (and creates the version if needed).

![Screenshot of a Jira Cloud issue with fix version](jira-cloud-screenshot.png)

## Inputs
- `commitId`: the ID (sha) of the relevant commit
- `mainBranch`: the main branch of the repo (e.g. "master" or "main")
- `baseDir`: (optional) the path of the git repo to use

## Outputs
None


## Example usage
```yaml
uses: levigo/github-action-jira-fixversion@v1.0
with:
  domain: "my-company.atlassian.net"
  username: "technical-user@company.net"
  password: "fmpUJkGhdKFvoTJclsZ03xw1"
  versionName: "1.0.5"
  versionDescription: "Continuous Delivery Version"
  issueKeys: "TEST-1"
```

### Usage with "GLIX Action – the Git Log Identifier eXtractor"

Here is an example on how to extract the `issueKeys` from the commit messages and set the same fix version
for all those Jira issues.

```yaml
      - uses: levigo/github-action-glix@v1.0
        id: glix
        with:
          commitId: ${{ github.sha }}
          mainBranch: "master"

      - uses: levigo/github-action-jira-fixversion@v1.0
        with:
          domain: "my-company.atlassian.net"
          username: "technical-user@company.net"
          password: "fmpUJkGhdKFvoTJclsZ03xw1"
          versionName: "1.0.5"
          versionDescription: "Continuous Delivery Version"
          issueKeys: ${{ steps.glix.outputs.issueKeys }}
```


### Usage with "Action Regex Match"

Here is an example on how to extract the `issueKeys` (but only the latest) from the commit message.
The regex is based on [Atlassian Documentation](https://confluence.atlassian.com/stashkb/integrating-with-custom-jira-issue-key-313460921.html).

```yaml
      - uses: actions-ecosystem/action-regex-match@v2
        id: regex-match
        with:
          text: ${{ github.event.head_commit.message }}
          regex: "((?<!([A-Z]{1,10})-?)[A-Z]+-\d+)"

      - uses: levigo/github-action-jira-fixversion@v1.0
        with:
          domain: "my-company.atlassian.net"
          username: "technical-user@company.net"
          password: "fmpUJkGhdKFvoTJclsZ03xw1"
          versionName: "1.0.5"
          versionDescription: "Continuous Delivery Version"
          issueKeys: ${{ steps.regex-match.outputs.match }}
```
