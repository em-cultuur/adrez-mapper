# adrez-mapper Revisions

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
