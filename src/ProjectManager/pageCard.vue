<template>
    <div class="card">
        <div class="img">
        </div>
        <div class="bottom">
            <div class="name">{{name}}</div>
            <Icon size="28" class="del">
                <CloseRound/>
            </Icon>
        </div>
    </div>
</template>

<script>
import {
  CloseRound
} from '@vicons/material'
import { Icon } from '@vicons/utils'
export default {
    name: 'PageCard',
    props: {
        name: String,
        img: Image,
    },
    components: {
        CloseRound,
        Icon,
    }
}
</script>

<style scoped>
*{
  transition: 0.2s;
}
.card{
    width: 256px;
    height: 192px;
    background-color: #2B303B;
    box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.25);
    border-radius: 3px;
}
.card:hover{
    background-color: #414958;
    cursor:pointer;
}
.card:hover .del{
    display: flex;
}
.img{
    width:100%;
    height: 144px;
    background-color: #A7AFBE;
    box-shadow: inset 0px -2px 4px rgba(0, 0, 0, 0.25);
    border-radius: 3px 3px 0px 0px;
}
.bottom{
    display: flex;
    justify-content: space-between;
    flex-direction: row;
    flex-wrap: nowrap;
    padding: 0 25px;
    width:206px;
    height: 48px;
    align-items: center;
}
.name{
    display:block;
    font-family: 'Inter';
    font-style: normal;
    font-weight: 700;
    font-size: 24px;
    line-height: 48px;
    text-overflow:ellipsis;

    overflow:hidden;
    white-space:nowrap;

    color: #E2E4E9;
}
.del{
    color:#A7AFBE;
    display:none;
}
</style>