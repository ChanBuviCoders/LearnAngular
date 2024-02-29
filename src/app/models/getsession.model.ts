
export class Getsession {
    data: userAccount
    error: string
    message: string
    status: boolean
    token:string

}


export class userAccount{
userAccountId: number
userName: string
password: string
firstName: string
lastName: string
gender: string
fathersName: string
email: string
marriedStatus: string
occupation: string
qualification: string
panNumber: string
address: string
adharImagePath:string
panImagePath:string
zipcode: number
city: string
state: string
dob: string
mobileNumber: number
altMobileNumber: number
annualIncome: number
lastLoginDate: string
currentLoginDate: string
adharNumber: number
active: boolean
userGroupId:number
}