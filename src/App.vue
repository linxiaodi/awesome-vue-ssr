<template>
	<div>
		<div>
			<router-link to="/">首页</router-link>
			<router-link to="/article">详情页</router-link>
		</div>
		<router-view></router-view>
	</div>
</template>

<script>
export default {
	name: 'app'
};
</script>

<style scoped>

</style>
