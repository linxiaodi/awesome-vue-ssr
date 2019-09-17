<template>
	<div>
		<h3>{{ article.title }}</h3>
		<h5>
			{{ article.author }}
		</h5>
		<p>{{ article.desc }}</p>
	</div>
</template>

<script>
import titleMixins from '../../core/mixins/head'

export default {
	name: 'v-article',
	mixins: [titleMixins],
	computed: {
		article() {
			return this.$store.state.article
		}
	},
	title() {
		return this.$store.state.article.title
	},
	async asyncData({ store, route }) {
		await store.dispatch('FETCH_ARTICLE')
		// this.$options.title = store.state.article.title;
	}
};
</script>

<style scoped>

</style>
