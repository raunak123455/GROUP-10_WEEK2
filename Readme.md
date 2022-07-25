### Group 1O

# Members

RAUNAK RANA


# Deployment

## 1- Vote contract deployment

RUNING SCRIPT:
`yarn ts-node ./scripts/1-deployVoteToken.ts`





## 2- CustomBallot.sol deployment

RUNING SCRIPT: 
`yarn ts-node ./scripts/2-deployCustomBallot.ts "ARG1" "ARG2" "ARG3" "ARG4" "ARG5" address 

Input args:
Proposals: "" "" "" ""

VoteToken Address: 

CONTRACT ADDRESS 
OUTPUT:



## 3- Mint MyToken Script

Runing script ( Script mints 10 MTK )

`yarn ts-node ./scripts/mintToken.ts addr1 addr2`

First Address is Token addres
Second address is mint to address

OUTPUT:

## 4- Delegate to self

Script is used in order to give voting power to self

\*\*TOKEN Address used here: addr1
Ballot address used here : addr2

RUNING SCRIPT:
`yarn ts-node ./scripts/3-delegateToSelf addr1 addr2

Input args:
Token Address :addr1
Ballot Address : addr2

Transaction  :

## 5- Delegate to others

\*\*TOKEN Address used here: addr1
Ballot address used here : addr2

RUNING SCRIPT:
`yarn ts-node ./scripts/4-delegateToOthers.ts <token address> <delegate-to>

Input args:
Token Address :addr1
Delegate To : addr2

Transaction  :

## 6- Cast Vote

Ballot address used here : address

RUNING SCRIPT:
`yarn ts-node ./scripts/5-castVote.ts <ballot address> <proposal id> <voting amount>`

Input args:
Ballot Address :
Proposal ID :1
voting amount :5

Transaction  :

## 6- The Winning Proposal

Ballot address used here : addr

RUNING SCRIPT:
`yarn ts-node --files scripts/6-winningProposal.ts <ballot address>`

Input args:
Ballot Address : addr

Output :








