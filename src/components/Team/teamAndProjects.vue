<template>
    <div class="oplist">
        <div v-for="item in options" :key="item.ID">
            <!-- <router-link :to="item.link"> -->
                <div class="teams option" :teamid="''+item.ID" @click="toTeam(item.ID)">
                    <div class="colorTag" :style="'background-color:'+item.color+';'"/>
                    <div class="desc">{{item.name}}</div>
                </div>
            <!-- </router-link> -->
            <div v-if="nowTeam===item.ID" class="proS">
            <div  v-for="pro in item.projects" :key="'pro'+pro.ID" class="projects option" :proid="''+pro.ID" @click="toProject(pro)">
                    <div class="colorTag" style="background:none;">
                    <Icon size="18">
                        <CaretRight20Regular  />
                    </Icon>
                    </div>
                    <div class="desc">{{pro.name}}</div>
            </div>
            </div>  
        </div>
    </div>
</template>

<script lang="ts">
import utils from '@/Utils'
import {darkTheme, useMessage} from "naive-ui";
import {useRoute} from 'vue-router'
import {Icon} from "@vicons/utils";
import {CaretRight20Regular} from "@vicons/fluent"
import router from '@/router';
import {defineComponent, h, Component,onMounted,onBeforeUpdate,ref,watch,computed,onUpdated} from 'vue'
import { Undefined } from '@vicons/carbon';
class Project{
    name:String;
    ID:Number;
    teamID:Number
}
export default defineComponent({
    components:{
        Icon,
        CaretRight20Regular
    },
    props:{
        options:[],
    },
    setup(props, {emit}) {
        const theme = darkTheme
        const nowTeam = ref(0)
        const route=useRoute()
        // console.log(props.options)
        const select=(teamId:Number,proId:Number)=>{
            let selectTeamId=teamId
            let selectProId=proId
            // let selectTeamId=router.currentRoute.value.query.teamID
            // if(selectTeamId==undefined)
            //     selectTeamId=-1
            // let selectProId=utils.getCookie('proID')
            let fullpath=router.currentRoute.value.fullPath
            // if(fullpath.slice(0,5)=='/team'){
            // if(teamId>=0&&proId<0){
                let menuitems=document.getElementsByClassName('teams') as HTMLCollectionOf<HTMLElement>
                // console.log('团队页面')
                for(var elementitem of menuitems){
                    console.log('target:'+selectTeamId)
                    console.log('searching:')
                    console.log(elementitem.attributes)
                    if(elementitem.attributes['teamid']==undefined)
                        continue
                    else if(elementitem.attributes['teamid'].value==selectTeamId)
                        elementitem.style['background']='#2B303B'
                    else
                        elementitem.style['background']='none'
                }
            if(fullpath.slice(0,8)=='/project'){

                let menuitems2=document.getElementsByClassName('projects') as HTMLCollectionOf<HTMLElement>
                // console.log('项目页面')
                for(var elementitem of menuitems2){
                    // console.log('target:'+selectTeamId)
                    // console.log('searching:')
                    // console.log(elementitem.attributes)
                    // console.log(elementitem.attributes['proid'])
                    if(elementitem.attributes['proid']==undefined)
                        continue
                    else if(elementitem.attributes['proid'].value==selectProId)
                        elementitem.style['background']='#414958'
                    else
                        elementitem.style['background']='none'
                }
            }
        }
        const toTeam=(id:Number)=>{
            
            nowTeam.value = parseInt(id.toString());
            emit('get')
            router.replace('/team/teamprojects?teamID=' + id)
        }
        const nowPro = ref(0)
        const toProject=(item:Project)=>{
            utils.setCookie('proID', item.ID)
            utils.setCookie('proNAME', item.name)
            utils.setCookie('proTeam', item.teamID)
            nowPro.value = parseInt(item.ID.toString())
            //select(-1,item.ID)
            router.push('/project/prototypes?teamID='+nowTeam.value)
            // select(-1,item.ID)
            select(parseInt(''+route.query.teamID),parseInt(utils.getCookie('proID')))
            emit('get')
            emit('renew')
        }
        const getGlobal = computed(() => {
            return route.query.teamID
            })
        watch([getGlobal,nowPro],([newTeam,nwePro],[oldTeam,oldPro])=>{
            console.log("哇哦 我监听到了")
            select(parseInt(''+route.query.teamID),parseInt(utils.getCookie('proID')))
        },{immediate: true, deep: true})
        onMounted(() => {
            console.log('options:')
            console.log(props.options)
            console.log(route.query.teamID+' '+parseInt(utils.getCookie('proID')))
            
            nowTeam.value = parseInt(''+route.query.teamID)
            
            select(parseInt(''+route.query.teamID),parseInt(utils.getCookie('proID')))
        })
        onBeforeUpdate(()=>{
            nowPro.value = parseInt(utils.getCookie('proID'))
            select(parseInt(''+route.query.teamID),parseInt(utils.getCookie('proID')))
        })
        onUpdated(()=>{
            select(parseInt(''+route.query.teamID),parseInt(utils.getCookie('proID')))
        })

        return{
            theme,
            nowPro,
            nowTeam,
            toProject,
            select,
            toTeam,
        }
        // console.log(props.options)
    }
})
</script>
<style scoped>
a {
  color: currentColor;
  text-decoration: none;
}
.projects{
    padding-left: 20px;
    font-size: small;
    height: 35px;
    font-weight: 300;
}
.teams{
    height: 42px;
}
.option{
    margin-right: 10px;

    font-size: 12px;
    display: flex;
    /* width: 100%; */
    align-items: center;
    flex-direction: row;
    flex-wrap: nowrap;
    border: 1px solid #A7AFBE00;
    transition: 0.2s;
    border-radius: 2px;
}
.option:hover{
    cursor:pointer;
    border: 1px solid #A7AFBE;

}
.option:active{
    background-color: #2B303B;
}

.colorTag{
    background-color: #A7AFBE;
    height:14px;
    width:14px;
    margin:15px;
}
.desc{
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
}
</style>