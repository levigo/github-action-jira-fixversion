# Jira create and set fix version

This action is intended for Continuous Delivery with Jira Cloud.
The action will set the "fix version" in Jira to the given version (and creates the version if needed).

![Screenshot of a Jira Cloud issue with fix version](jira-cloud-screenshot.png)

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

### Usage with "Action Regex Match"

Here is an example on how to extract the `issueKey` from the commit message
```yaml
      - uses: actions-ecosystem/action-regex-match@v2
        id: regex-match
        with:
          text: ${{ github.event.head_commit.message }}
          regex: "[A-Z]{1,}[-]{1,}[0-9]{1,}"

      - uses: levigo/github-action-jira-fixversion@v1.0
        with:
          domain: "my-company.atlassian.net"
          username: "technical-user@company.net"
          password: "fmpUJkGhdKFvoTJclsZ03xw1"
          versionName: "1.0.5"
          versionDescription: "Continuous Delivery Version"
          issueKeys: ${{ steps.regex-match.outputs.match }}
```