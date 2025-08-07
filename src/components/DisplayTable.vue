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
<tr v-for="user in display_value" :key="user.mobilenumber">
<td>{{ user.firstname }}</td>
<td>{{ user.lastname }}</td>
<td>{{ user.dateofbirth ? user.dateofbirth.slice(0,10) : ' ' }}</td>
<td>{{ user.mobilenumber }}</td>
<td>{{ user.address }}</td>
<td>
<input type="button" v-on:click="editData(user.mobilenumber)" value="EDIT">
<input type="button" v-on:click="deleteData(user.mobilenumber)" value="DELETE">
</td>
</tr>
</tbody>
</table>
</div>
</div>
</template>
<script>
export default {
name: 'DisplayTable',
data(){
    return {
        display_value: []
    };
},
methods:{
    editData(mobilenumber){
        this.display_value=mobilenumber;
        this.$router.push(`/edit/${mobilenumber}`);
    },
    async deleteData(mobilenumber){
        await fetch(`http://localhost:8080/api/users/${mobilenumber}`,{
            method: 'DELETE'
    })
    .then(response=>{
        
    console.log(response)
  response.json()
    })
    .then(data =>{
        console.log(data);
        this.display_value= data;
        this.$router.push('/display');
    })
    .catch(error=>{
        console.log("error in data deletion",error)
    })
    }
},
mounted(){
fetch('http://localhost:8080/api/users')
.then(res=>res.json())
.then(data=>{
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
    color: red;
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
table tr td input{
    padding: 1vh;
   margin-left:1vh;
    color:white;
    background-color: green;

}

</style>