<template>
    <div class="nav">
        <div class="logo">This is a logo</div>
        <div class="UserCard">
            <div class="pic">
                {{nickname[0]}}
            </div>
            <div class="user">
                {{nickname}} <br/>
                <span style="color:rgba(167, 175, 190, 1);font-size:small;">{{email}}</span>
            </div>
            <div class="teams">
                <div class="teamsHead">
                团队和项目</div>
                <ul>
                    
                    <li  :key="item.id" v-for="(item) in teams">
                        <div class="li">
                         <a href="">
                        <div class="pack">
                           
                        <div class="src">
                        </div>
                        <div class="TeamName">
                            {{item.name}}
                        </div>
                            
                        </div>
                        </a>
                        </div>
                    </li>
                   
                </ul>
                <div class="NewTeam">
                    <a href="">
                    <div class="plus">
                        <img src="@/assets/plus.png"/>
                    </div>
                    <div class="word">
                     新建团队
                    </div>
                    </a>
                </div>
            </div>
        </div>
    </div>
</template>
<style scoped>
.plus {
    vertical-align: middle;
    display: inline-block;
}
.word{
    margin-left: 20px;
    font-size: smaller;
    display: inline-block;
}
.NewTeam a{
    color: rgba(167, 175, 190, 1);
}

.plus img{
    width: 20px;
    height: 20px;
}
.nav{
    background-color: rgba(43, 48, 59, 1);
    height: calc(100%);
    padding-top: 20px;
    padding-left: 20px;
}
.logo{
    width: 200px;
    height: 56px;
    background-color: rgba(217, 217, 217, 1);
    text-align: center;
    line-height: 56px;
}
.pic{
    width: 36px;
    height: 36px;
    text-align: center;
    line-height: 36px;
    border-radius: 50%;
    background: skyblue;
    display: inline-block;
    vertical-align: top;
}
.UserCard{
    margin-top: 20px;

}
.card{
    width: 100%;
    height: 60px;
}
.user{
    margin-left: 20px;
    display: inline-block;
    color: rgba(255, 255, 255, 1);
    font-size: larger;
}
.teams{
    margin-top: 40px;
    font-size: large;
    font-weight: 500;
    color: white;
    
}

.teamsHead{
font-family: 黑体;
}
.src{
    width: 20px;
    height: 20px;
    margin-left: 20px;
    background-color: bisque;
    vertical-align: middle;
    display: inline-block;
    margin-top: 12px;
    margin-bottom: 12px;
}
.TeamName{
    margin-left: 24px;
    display: inline-block;
    line-height: 20px;
    vertical-align: middle;
}
ul{
    list-style-type: none;
    padding-inline-start: 0px;
}
li{
    
    margin-left: -20px;
    
}
li a{
    color: white;
}
a:hover{
    color: pink;
}
.NewTeam{
    color: rgba(167, 175, 190, 1);
}
.pack:hover{
    border: 1px rgba(190, 169, 255, 1) solid;
}
</style>
<script setup lang="ts">
import {ref } from 'vue'

let nickname = ref<String>('Loading...')
let email = ref<String>('email@163.com')
const teams = ref([
    {
        id:1,
        src:'T',
        name:'Team'
    },
    {
        id:1,
        src:'T',
        name:'Team'
    },
    {
        id:1,
        src:'T',
        name:'Team'
    }
])
</script>