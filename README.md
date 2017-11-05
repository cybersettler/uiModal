# uiModal
> Websemble modal component

## Getting started

Include UI Modal in your project dependencies
(see [websemble generator]
  (https://github.com/cybersettler/generator-websemble/wiki)).
In your project's bower.json:

```json
{
  "dependencies": {
    "uiModal": "cybersettler/uiModal"
  }
}
```

In your view you would insert an HTML tag like so:

```html
<ui-modal>
  ...
</ui-modal>
```

## API

### data-model

Data to be used in the modal.


### data-display

Display configuration of the modal. The display object supports the following options:

* __title__(string): Modal title
* __content__(string): Modal content
* __options__(array): Modal options
    * __label__(string): option label
    * __type__(enum: confirm | reject): option type
    * __styleClass_(enum: default | primary): option style
