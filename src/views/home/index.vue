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
import titleMixins from '../../core/mixins/head'

export default {
	name: 'home',
	mixins: [titleMixins],
	computed: {
		list() {
			return this.$store.state.home
		}
	},
	title: '博客',
	async asyncData({ store, route }) {
		await store.dispatch('FETCH_HOME')
	}
};
</script>

<style scoped>

</style>
