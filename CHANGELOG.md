# adrez-mapper Revisions

### 2025-05-27 v1.14.2 @jurgen
- add: kvkNumber to mapper

### 2025-05-27 v1.14.1 @jurgen
- add: kvkNumber to contact and contact locator

### 2023-01-05 v1.14.0 @jurgen 2023-01-05
- add: _campaignContactParent to memo, code & extra
- add: _key to campaignContact
- add: sourceId to contact locator

### 2022-09-02 V.13.02
- fix: contact.search is not returned if it's an organisation 

### 2022-08-29  v1.13.1
- add: check contact for _parent key
- fix: _parent gets lost for a record

### 2022-04-14 V1.13.0 @jay 2022-04-14
- upd: update all libraries
- fix: url scan does not work with case sensive 
- add: test for url scan in records

2022-03-14 (v1.12.0)
- chg: the url is scanned. See documentation
- chg: url properties are all in lowercase

2022-03-12 (v1.11.1)
- add: url lookup translator from Facebook to code id
- fix: url link {linkedin: 'testing'} get the proper type id
- 
20-09-29
- add: code.typeGuid let the informatie be stored

2021-09-28
- add: LocatorContact trueName to search on Erick de Boer in fullName

2021-07-20
- chg: street number left moves number to number part (1.9.0)

2021-06-22
- chg: locator without fields removes the locator
- chg: locator with empty string fields, will remove locator 

2021-06-15
- add: location.streetNumber can parse English numbers
- chg: standard removes space from names

2021-05-19 (1.7.0)
- rebuild of empty checker. Remove emptyAllow and added addStoreGroup.

2021-05-17 (1.6.7)
- add: added link to _mode to check/set the sync id for the record

2021-05-17 (1.6.5 / 1.6.6)
- add: added force to mode so empty record can be handled

2021-05-15 (1.6.3)
- fix: _mode makes a record forced to store
- add: contactLocator.namePrefix

2021-04-03 (1.6.2)
- fix: _source was removed from the contact

2021-03-09 (1.6.1)
- fix: campaignContact.typeGuid is not called

2021-03-09 (1.6.0)
- add: zipCity for netherlands and belgium

2020-12-15 v2.5
- add: zipcity

2020-11-27
- add: contact.useParentLocation

2020-11-26
- add: location.isPrimary: true, false, leave, all, allLeave) 

2020-11-25
- add: contact.sortName where McAnser, Jay is translated to Jay McAnser
- fix: part of url is removed

2020-11-24
- chg: empty telephone.type gets a default type
- chg: empty email.type gets a default type
- chg: if typeId is set, no lookup is done

2020-11-17
- add: _mode: blocked

2020-10-05
- chg: code if empty type, typeId and text it's removed

2020-08-19
- chg: webhook only updates partial fields, so functionId, salutationId are only set if a value is given, if guid set to false the default is loaded
- chg: contact.type is only set if values are given or typeGuid is et

2020-08-18
- fix: fullname can not be set by mapper
- fix: remove namePrefix if name is given but no prefix
- fix: if guid is nummeric it's converted to number

2020-08-13
- add: _mode: kill to remove a code that has a delete flag set

2020-08-10
- fix: _allowMulti generates empty locators what creates empty contacts

2020-08-10
- fix: _mode stop removing empty objects

2020-08-05
- fix: type of extra field is not set in database
- add: field-campaign-contact.actionDate
- fix: major bug in reading _mode definition

2020-08-04
- add: /adrezId to set the address_ID of the record. Overrules the contactId

2020-07-23
- add: _mode inherit to set the same mode to the location or code as the contact
- fix: test if lookup exist
- fix: _mode not loaded on contact.organisation
- add: better contact handling

2020-07-18
- change binary to set
- add: _mode: skip (8)

2020-06-16
- add: locator-contact: email
- add: locator-contact: _allowMulti
- add: binary _mode for object (contact, telephone, etc)

2020-06-02
- add: auto array for record elements
- chg: country lookup param changes
- add: test memo

2020-06-29
- add: name parser can be configured by a config. Keys: suffix, prefix, titles 
- fix: campaign.group (groupGuid, group, groupId). Callback: campaignGroup
- chg: the memo return value NOT text

2020-06-28
- fix: campaign action should call campaignContact
- fix: campaign action stored

2020-06-27
- fix: removed campaign.campaignDate default value
- fix: campaignContact with new lookup, campaign and contact
- chg: campaign action and type are lookups

2020-06-26
- add: field-text-binary

2020-06-18
- Object.typeInsertOnly
- added the fieldTypeInsertOnly to the code (object) class definition

2020-04-29
- better streetNumber parser
- missing location.countryId if not defined
- location.streetNumber parse of the '

2020-04-18 (0.6)
- changed LocatorContact and LocatorCampaign so empty field will remain in the locator.
- LocatorContact / Camptaign field are only removed if undefined

2020-04-15 (0.5.12)
- changed code.guid to code.codeGuid

2020-04-15 (0.5.12)
- fix: contact.subName removed from gender
- fix: contact.subName better implemented
- fix: contact.subName is not copied to result
- fix: contact.typeGuid is part of lookup.gender()


2020-04-15 (0.5.11)
- fix: location.zipcode if not found throws an error

2020-04-10 (0.5.10)
- changed campaign lookup to handle default construction
- changed doc

2020-04-10 (0.5.9)
- locator-contact: added subName and name


2020-03-23 (0.5.8)
- contact._campaign to define which campaign we connect to. If empty / missing all is used

2020-03-23 (0.5.7)
- campaign.action has now a standized lookup function


2020-03-17 (0.5.6)
- Campaign code / Code guid converted to typeGuid for definition

2020-02-23 (0.5.5)
- added _rowIndex for debugging

2020-02-22
- changed useDescription (object) to useDescription for memo and extra
- added data to the lookup definition
- useDescription auto set for extra fields. Can be overruled by setting useDescription

2020-02-19 (0.5.4)
- typo in doc for memo
- made test routines for memo
- added memo text and memo.description and memo.useDescription
- for memo to have a type ('' is default)
- added typeIsDefault to memo, codes and location to set isDefault in the code table
- default parentId for memo is 0

2020-02-14 (0.5.3)
- better explain for type mismatch with text fields
- boolean is stored as  '1'
- added optional lookup in code **type_**
- fix: emptyAll && allowEmpty error
- fix: "streetNumber issues (location wordt niet opgeslagen als fout in parsing) #13"

2020-02-13 (0.5.1)
- location does not request the translation from type to typeId
- change lookup for function standard
- change lookup for salutation to standard
- typeId is not set to default if location has only zipcode and number

2020-02-04 (0.5.0)
- type/typeId is not stored the way a propperty. Full rebuild of field-composed part.
- adjusted url
- added email.newsletter, email.prive with auto type definition

2020-02-02 (0.4.16)
- if the telephone number is not valid it is still return and a warning is added to the log
- (phonenumber issues #15) - if telephone to long the #import is appended. Can be set by options.ERROR_CODE
- (telephone issues #14) - value of the telephone field with #import appended and is stored and in the error report
- (emailadres/telefoon en adres naar code_ID 115,113, 11 #12). Fix so the type is automatically set.
If a manual changes is needed use the type or typeId
- fixed: if an invalid email the value is not stored. Now the #import is appended and a warning is added to the log

2020-02-01 (0.4.13)
- the url is now extended so can include configurable "Facebook", etc
- default type is set to 117. it can be changed by setting the **DEFAULT_CODE_URL** of the options.url 
- documentation adjusted so it can read different formats of urls
