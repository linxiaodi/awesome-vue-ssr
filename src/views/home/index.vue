<template>
	<div>
		<ul>
			<li v-for="(item, idx) in list" :key="item">
				<router-link to="/article">{{ item }}</router-link>
			</li>
		</ul>
	</div>
</template>

<script>
export default {
	name: 'home',
	computed: {
		list() {
			return this.$store.state.home
		}
	},
	async asyncData({ store, route }) {
		await store.dispatch('FETCH_HOME')
	}
};
</script>

<style scoped>

</style>
