<template>
<div id="container">

<div id="box">

<form >
<h1>Edit Form</h1>
<div class="column">
<label for="fName">First Name:</label>
<input type="text" id="fName" name="fName" placeholder="Enter your first name" v-model="formObj.fname" required>
</div>
<div class="column">
<label for="lname">Last Name:</label>
<input type="text" id="lname" name="lname" placeholder="Enter your last name" v-model="formObj.lname">
</div>
<div class="column">
<label for="dob">Date of Birth:</label>
<input type="date" id="dob" name="dob" placeholder="Enter your birth date" v-model="formObj.dob">
</div>
<div class="column">
<label for="mnumber">Mobile number:</label>
<input type="phone" id="mnumber" name="mnumber" placeholder="Enter your mobile number" v-model="formObj.mnumber" readonly>
</div>
<div class="column">
<label for="address">Address:</label>
<textarea id="address" name="address" placeholder="Enter your address" v-model="formObj.address"></textarea>
</div>
<div class="column">
<button type="button" v-on:click="backData">EDIT</button>
<button v-on:click="displayData" type="button">SHOW TABLE</button>
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
            fname: '',
            lname: '',
            dob: '',
            mnumber: '',
            address: ''
        }
        }
        
    },
    mounted(){
        this.formObj.mnumber = this.$route.params.mobile;
        axios.get(`http://localhost:8080/api/users/${this.formObj.mnumber}`)
        .then(response=>{
            
            const data = response.data;
            console.log(data);
            console.log(data.firstname)
            const isDate= data.dateofbirth.slice(0,10)
            this.formObj.fname=data.firstname;
            this.formObj.lname=data.lastname;
            this.formObj.dob=isDate;
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
            axios.put(`http://localhost:8080/api/users/${this.formObj.mnumber}`,this.formObj)
            .then(response=>{
                console.log(response.data);
                this.$router.push('/')
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
    display:flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: lavender;
    border-radius: 5vh;
}
h1{
    color: red;
    text-align: center;
}
#box{
    border: 2px solid black;
    height: 80%;
    width: 50%;
    background-color: #9966CC;
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
    background-color: green;
    margin-left: 10%;
}
</style>
