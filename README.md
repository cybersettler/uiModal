# uiModal
> Weldkit modal component

## Getting started

Include UI Modal in your project dependencies:

```javascript
npm install ui-modal --save
```

In your view you would insert an HTML tag like so:

```html
<ui-modal>
  ...
</ui-modal>
```

The modal display, model, and callbacks may be specified
as tag attributes or by passing a configuration object with
the _openDialog_ event.

Modal display may be specified as tag attribute, in _openDialog_ event
detail or as tag content, like so:

```html
<ui-modal>
  <header data-closebtn="true">
    Test
  </header>
  <div>Hello World!</div>
  <footer>
    <button data-role="accept" class="primary">Ok</button>
  </footer>
</ui-modal>
```

## API

### data-model

Data to be used in the modal.

### data-display

Display configuration of the modal. The display object supports the following options:

* __header__(object): Modal header
    * __title__(string): Modal title
    * __closebtn__(boolean): Display close button in the header
* __body__(string): Modal content
* __footer__(object): Modal footer
    * __options__(array): Modal options
      * __label__(string): option label
      * __type__(enum: confirm | reject): option type
      * __styleClass__(enum: default | primary): option style

### data-confirm

Confirm event callback function, called when the user
confirms the dialog.

### data-reject

Reject event callback function, called when the user
rejects the dialog.

### openDialog event

An event with type _openDialog_ will be dispatched
by the modal component to open a dialog. The content
and callbacks of the dialog may be specified in the
detail of a Custom Event with the following attributes:

* __model__(string | object): A data object or URI or
a callback for the data model. Callbacks should be written
without curly braces.
* __display__(string | object): Display configuration callback,
or configuration object.
* __confirm__(string): Confirm callback, without curly braces.
* __reject__(string): Reject callback, without curly braces.
