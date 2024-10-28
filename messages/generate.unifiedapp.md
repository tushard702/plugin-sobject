# summary

Generate the metadata source files for a new Unified Application.

# description

Some unified Application description.

This command must be run in a Salesforce DX project directory. You must pass all required information to it with the required flags. The source files for the custom object for which you're generating a tab don't need to exist in your local project.

# flags.label.summary

The name of the unified application.

# flags.description.summary

The description of the unified application.

# examples

- Create a tab on the `MyObject__c` custom object:

  <%= config.bin %> <%= command.id %> --object `MyObject__c` --icon 54 --directory force-app/main/default/tabs

# success

Generated a unifiedapp file with name %s at path %s.
