# Jira create and set fix version

This action is intended for Continuous Delivery with Jira Cloud.
The action will set the fix version in Jira to the given version (and creates the version if needed).

## Example usage
```yaml
uses: actions/github-action-jira-fixversion@v1.0
with:
    version: '1.0.2'
```