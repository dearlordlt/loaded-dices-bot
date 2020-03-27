# loaded-dices-bot
go cheat
## ideas
### variables
!var (variable) (value)

e.g. 
```
!var bow 18  
```
regsiters new map (vovierius; bow; 18)

to use a var:
```
1) !c bow
2) !c bow -3
```
translates to:
```
1) !c 3 + 18
2) !c 3 + 15
```
list all variables:
```
> !var
```
translates to:
```
variables for {user}:
bow 18
evade 20
sword 15
```

### context
sets context to all rolls e.g. 
```
!context autofail 7
```
