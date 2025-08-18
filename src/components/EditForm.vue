<template>
<div id="container">

<div id="box">

<form >
<h1>Edit Form</h1>
<div>
<div class="column">
<label for="firstName">First Name:</label>
<input type="text" id="firstName" name="firstName" placeholder="Enter your first name" v-model="formObj.firstName" >
</div>
<p v-if="error.firstName">{{error.firstName}}</p>
</div>
<div>
<div class="column">
<label for="lastName">Last Name:</label>
<input type="text" id="lastName" name="lastName" placeholder="Enter your last name" v-model="formObj.lastName">
</div>
<p v-if="error.lastName">{{ error.lastName }}</p>
</div>
<div>
<div class="column">
<label for="dob">Date of Birth:</label>
<input type="date" id="dob" name="dob" placeholder="Enter your birth date" v-model="formObj.dob">
</div>
<p v-if="error.dob">{{ error.dob }}</p>
</div>
<div>
<div class="column">
<label for="mobileNumber">Mobile number:</label>
<input type="tel" maxlength="10" id="mobileNumber" name="mobileNumber" placeholder="Enter your mobile number" v-model="formObj.mobileNumber">
</div>
<p v-if="error.mobileNumber">{{ error.mobileNumber }}</p>
</div>
<div>
<div class="column">
<label for="address">Address:</label>
<textarea id="address" name="address" placeholder="Enter your address" v-model="formObj.address"></textarea>
</div>
<p v-if="error.address">{{ error.address }}</p>
</div>
<div class="column">
<button type="button" v-on:click="backData">UPDATE</button>
<button v-on:click="displayData" type="button">BACK</button>
</div>
</form>
</div>
</div>
</template>

<script>
import axios from 'axios';
export default {
    name: 'EditForm',
    data() {
        return {
            formObj:{
            firstName: '',
            lastName: '',
            dob: '',
            mobileNumber: '',
            address: ''
        },
         error:[],
        }
        
    },
    mounted(){
        const user_id=this.$route.params.user_id;
        axios.get(`http://localhost:8080/api/users/getUser/${user_id}`)
        .then(response=>{
            
            const data = response.data;
            console.log(data);
            
            const isDate= data.dob.slice(0,10)
            this.formObj.firstName=data.first_name;
            this.formObj.lastName=data.last_name;
            this.formObj.dob=isDate;
            this.formObj.mobileNumber =data.mobile_number ;
            this.formObj.address=data.address;
        })
        .catch(error=>{
            console.log("error in fetching data",error);
        })
    },
    methods:{
        displayData(){
             this.$router.push('/display')
        },
        backData(){
            const user_id = this.$route.params.user_id;
            this.error = [];
            if(this.formObj.firstName.length<3 && this.formObj.firstName){
                    this.error.firstName='First Name should be greater than 3';
                }
                if(!/^[A-Za-z]+$/.test(this.formObj.firstName) && this.formObj.firstName.length){
                    this.error.firstName='First Name cannot be numbers';
                }
                if(this.formObj.lastName.length<3 && this.formObj.lastName){
                    this.error.lastName='Last Name should be greater than 3';
                }
                if(!/^[A-Za-z]+$/.test(this.formObj.lastName) && this.formObj.lastName){
                    this.error.lastName='Last Name cannot be numbers ';
                }
                const today = new Date();
                
                if(this.formObj.dob){
                    const isDate = new Date(this.formObj.dob);
                    if(isDate > today){
                    this.error.dob='Enter a valid date ';
                }
                }
                if(!/^[6-9]\d{9}$/.test(this.formObj.mobileNumber) && this.formObj.mobileNumber){
                    this.error.mobileNumber='Mobile Number is of 10 digit only';
                }
                if(/^[A-Za-z]+$/.test(this.formObj.mobileNumber)){
                    this.error.mobileNumber='Mobile Number is of numbers only';
                }
            axios.put(`http://localhost:8080/api/users/updateUser/${user_id}`,this.formObj)
            .then(response=>{
                console.log(response.data);
                this.$router.push('/display')
               
            })
            .catch(error=>{
                console.log("error occured",error)
            })
            
        }
    }

}

</script>

<style scoped>
#container {
    margin-top: 5%;
    display:flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    background-color: lavender;
    border-radius: 5vh;
}
h1{
    color: black;
    text-align: center;
}
p{
    flex-basis: 100%;
    color:red;
    font-weight:bold;
    
    margin-top: -2%;
    margin-left: 39%;
}
#box{
    
    height: 80%;
    width: 50%;
    background-color: white;
    border-radius: 5vh;
}
.column {
    display: flex;
    padding-top: 1vh;
}
.column label,button {
    width: 30%;
    margin: 2%;
    padding: 1%;
    font-size: 18px;
    font-weight: bold;
}
.column input, textarea{
    width: 50%;
   margin: 2%;
    padding: 1%;
    font-size: 14;
    height: 20%;
}
.column textarea{
    resize: vertical;
}
.column button{
    color: white;
    background-color: black;
    margin-left: 10%;
}
</style>
