<template>
<div>
<h1>User Details</h1>
<div id="table">
<table>
<thead>
<tr >
<th>First Name</th>
<th>Last Name</th>
<th>Date of birth</th>
<th>Mobile Number</th>
<th>Address</th>
<th>Action</th>
</tr>
</thead>
<tbody>
<tr v-for="user in display_value" :key="user.user_id">
<td>{{ user.first_name }}</td>
<td>{{ user.last_name }}</td>
<td>{{ user.dob }}</td>
<td>{{ user.mobile_number }}</td>
<td>{{ user.address }}</td>
<td>
<input type="button" v-on:click="editData(user.user_id)" value="EDIT">
<input type="button" v-on:click="deleteData(user.user_id)" value="DELETE">
</td>
</tr>
</tbody>
</table>
</div>
<br/>
<input type="button" v-on:click="createNewUser" value="CREATE NEW USER">
</div>
</template>
<script>
 
export default {
   
name: 'DisplayTable',
data(){
    return {
        display_value: [],
        
    };
},
methods:{
    createNewUser(){
        this.$router.push('/')
    },
    editData(user_id){
        this.$router.push(`/edit/${user_id}`);
    },
    async deleteData(user_id){
        await fetch(`http://localhost:8080/api/users/deleteUser/${user_id}`,{
            method: 'DELETE'
        })
    .then(response=>{
        console.log(response)
    return response.json()
    .then(data=>{
        console.log(data.users)
        this.display_value= data.users;
    })
   
    })
    .catch(error=>{
        console.log("error in data deletion",error)
    })
    }
},
mounted(){
fetch('http://localhost:8080/api/users/getAllUsers')
.then(res=>res.json())
.then(data=>{
    // console.log(data);
    // console.log(data.dob);
        
    this.display_value=data;
})
.catch(error =>{
    console.log("error in data fetching",error);
});
}
}
</script>
<style scoped>
h1{
    color: black;
    text-align: center;
}
table, tr, td, th {
    border: 2px black solid;
    
}
table td{
    font-size: 14px;
    padding:2vh;
}
table th{
    color: blue;
    font-weight: bold;
    font-size: 18px;
    padding: 2vh;
}
#table {
    display: flex;
    justify-content: center;
}
input[type=button], table tr td input{
    padding: 1vh;
   margin-left:1vh;
    color:white;
    background-color: black;

}

</style>