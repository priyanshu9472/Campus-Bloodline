# Blood Bank Application API Endpoints

## User Endpoints
- [Create User](http://localhost:3000/api/users/register) - `POST`
- [Login User](http://localhost:3000/api/users/login) - `POST`
- [Logout User](http://localhost:3000/api/users/logout) - `POST` (requires token)

## Donation Endpoints
- [Create Donation](http://localhost:3000/api/donations) - `POST`
- [Get All Donations](http://localhost:3000/api/donations) - `GET`
- [Get Donations by Donor](http://localhost:3000/api/donations/donor/:donorId) - `GET`
- [Delete Donation](http://localhost:3000/api/donations/:id) - `DELETE`
