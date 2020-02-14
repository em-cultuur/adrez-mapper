[Home](../README.md)

## code and the tree

To automatically insert codes into the selection code system, the tree must be maintained. To do so the codes can
include the value of the parent they will be added to.

- parentId - the id of the parent if knonw (very restrictive and _not_ portable)
- parentGuid - the Guid of the code to use as parent
- parentText - the text to find with a groupId of 10. If multiple are found, the first one is used

examples:

1. insert a basic contact with code
```javascript
{
  contact: [ { fullName: 'John Doe'}],
  code: [
          {
            type: 'Please call now',
            typeGuid: 'TST_CALL_NOW',
            parentText: 'call rate',
            parentGuid: 'TST_CALL'
          }
    ]
}
```
This will look for the code with the guid 'TST_CALL_NOW'. If found it's used. If not found, it looks for the code
with the text 'Please call now'. If found, it's used. If not found as new code will be created. But first the parent
must be located. It will look for the code with the guid 'TST_CALL', if not found, it will look for the text 'call rate'.
 **If not found no parent will be used (parentId=0)**.
Finally the code will be added with the text of 'Please call now', the guid 'TST_CALL_NOW' and the parentId of the TST_CALL record
(or 0).


2. blocking a code from being inserted by it's text
In the previous example we will lookup the code, if not found by the guid, by the type. This can be dangerous. If the 
text does exist somewhere else in the code tree, unintended links can occur. To block this on can use the type_ instead of 
the type definition. The type_ does not do a lookup upon the text.

```javascript
{
  contact: [ { fullName: 'John Doe'}],
  code: [
          {
            type_: 'Please call now',
            typeGuid: 'TST_CALL_NOW',
            parentText: 'call rate',
            parentGuid: 'TST_CALL'
          }
    ]
}
```
The system will not look for the the code 'Please call now', but will insert it if not found
