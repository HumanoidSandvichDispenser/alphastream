<template>
    <li class="member-container">
        <div class="member"><img v-if="badge != undefined" :src="badge">{{ member }} {{ isHost ? "(Host)" : "" }}</div>
    </li>
</template>

<script>
export default {
    props: {
        member: String,
        badge: String,
        isHost: Boolean,
    },
}
</script>

<style>
.member {
    font-weight: 400;
    padding: 8px;
    z-index: 10;
}

.member-container:nth-child(even) .member {
    background: #161616;
}
</style>