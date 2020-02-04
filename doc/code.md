[Home](../README.md)

## code and the tree

To automatically insert codes into the selection code system, the tree must be maintained. To do so the codes can
include the value of the parent they will be added to.

- parentCodeId - the id of the parent if knonw (very restrictive and _not_ portable)
- parentCodeGuid - the Guid of the code to use as parent
- parentCode - the text to find with a groupId of 10. If multiple are found, the first one is used

examples:

1. add a code
```javascript
  {
    type: 'Please call now',
    parentCode: 'call rate'
  }
// result:
// will insert into the code: { caption: 'please call now', groupId: 10, parentId: 1234 } === code.id = 1345
  {
    typeId: 1345    
  }
```

2. add a code with an guid
```javascript
  {
    type: 'Please no calls',
    parentCode: 'call rate',
    parentCodeGuid: 'CALL_RATE'
  }
// result:
// check if the parent with guid CALL_RATE exist, if not add this with the caption: 'call rate'  (id = 4444) 
// insert if not found into the code: { caption: 'please no calls', groupId: 10, parentId: 4444 } === code.id = 1346
  {
    typeId: 1346    
  }
```
