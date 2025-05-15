<script>
	import { mode, toggleMode } from 'mode-watcher';
	import { onMount } from 'svelte';

	let isMenuOpen = false;
	let isScrolled = false;

	onMount(() => {
		// Handle scroll for navbar transparency
		const handleScroll = () => {
			isScrolled = window.scrollY > 20;
		};

		window.addEventListener('scroll', handleScroll);

		return () => {
			window.removeEventListener('scroll', handleScroll);
		};
	});

	// Toggle mobile menu
	function toggleMenu() {
		isMenuOpen = !isMenuOpen;
	}

	// Toggle dark mode
</script>

<div
	class="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 text-gray-900 dark:from-gray-900 dark:to-gray-800 dark:text-gray-100"
>
	<!-- Header -->
	<header
		class={`fixed z-50 w-full transition-all duration-300 ${isScrolled ? 'bg-white/90 shadow-sm backdrop-blur-sm dark:bg-gray-900/90' : 'bg-transparent'}`}
	>
		<div class="container mx-auto px-4 sm:px-6 lg:px-8">
			<div class="flex h-16 items-center justify-between">
				<!-- Logo -->
				<div class="flex flex-shrink-0 items-center">
					<span class="text-2xl font-bold text-[#db324d]">Erinias</span>
					<span
						class="ml-2 rounded-full bg-pink-100 px-2 py-1 text-xs font-medium text-[#db324d] dark:bg-pink-900 dark:text-pink-100"
						>BETA</span
					>
				</div>

				<!-- Desktop Navigation -->
				<nav class="hidden items-center space-x-8 md:flex">
					<a
						href="#features"
						class="text-gray-700 transition-colors hover:text-[#db324d] dark:text-gray-300 dark:hover:text-[#f04d6a]"
						>Features</a
					>
					<a
						href="#"
						class="text-gray-700 transition-colors hover:text-[#db324d] dark:text-gray-300 dark:hover:text-[#f04d6a]"
						>About</a
					>
					<a
						href="#"
						class="text-gray-700 transition-colors hover:text-[#db324d] dark:text-gray-300 dark:hover:text-[#f04d6a]"
						>Support</a
					>

					<!-- Dark Mode Toggle -->
					<button
						on:click={() => toggleMode()}
						class="rounded-full bg-gray-200 p-2 text-gray-700 transition-colors hover:bg-gray-300 focus:outline-none dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
						aria-label="Toggle Dark Mode"
					>
						{#if mode.current === 'dark'}
							<!-- Sun icon for light mode -->
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-5 w-5"
								viewBox="0 0 20 20"
								fill="currentColor"
							>
								<path
									fill-rule="evenodd"
									d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
									clip-rule="evenodd"
								/>
							</svg>
						{:else}
							<!-- Moon icon for dark mode -->
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-5 w-5"
								viewBox="0 0 20 20"
								fill="currentColor"
							>
								<path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
							</svg>
						{/if}
					</button>
				</nav>

				<!-- CTA Button -->
				<div class="hidden md:flex">
					<a
						href="/chat"
						class="rounded-lg bg-[#db324d] px-4 py-2 font-medium text-white transition-colors hover:bg-[#c02843]"
					>
						Enter App
					</a>
				</div>

				<!-- Mobile menu button and dark mode toggle -->
				<div class="flex items-center space-x-2 md:hidden">
					<!-- Dark Mode Toggle (Mobile) -->
					<button
						on:click={toggleMode}
						class="rounded-full bg-gray-200 p-2 text-gray-700 transition-colors hover:bg-gray-300 focus:outline-none dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
						aria-label="Toggle Dark Mode"
					>
						{#if mode.current === 'dark'}
							<!-- Sun icon for light mode -->
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-5 w-5"
								viewBox="0 0 20 20"
								fill="currentColor"
							>
								<path
									fill-rule="evenodd"
									d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
									clip-rule="evenodd"
								/>
							</svg>
						{:else}
							<!-- Moon icon for dark mode -->
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-5 w-5"
								viewBox="0 0 20 20"
								fill="currentColor"
							>
								<path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
							</svg>
						{/if}
					</button>

					<!-- Mobile menu button -->
					<button
						on:click={toggleMenu}
						class="inline-flex items-center justify-center rounded-md p-2 text-gray-700 hover:text-[#db324d] focus:outline-none dark:text-gray-300 dark:hover:text-[#f04d6a]"
					>
						<svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							{#if isMenuOpen}
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M6 18L18 6M6 6l12 12"
								/>
							{:else}
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M4 6h16M4 12h16M4 18h16"
								/>
							{/if}
						</svg>
					</button>
				</div>
			</div>
		</div>

		<!-- Mobile menu -->
		{#if isMenuOpen}
			<div class="bg-white shadow-lg dark:bg-gray-900 md:hidden">
				<div class="space-y-1 px-2 pb-3 pt-2 sm:px-3">
					<a
						href="#features"
						class="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
						>Features</a
					>
					<a
						href="#"
						class="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
						>About</a
					>
					<a
						href="#"
						class="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
						>Support</a
					>
					<a
						href="#"
						class="block rounded-md bg-[#db324d] px-3 py-2 text-base font-medium text-white hover:bg-[#c02843]"
						>Enter App</a
					>
				</div>
			</div>
		{/if}
	</header>

	<!-- Hero Section -->
	<section class="pb-20 pt-32 md:pb-28 md:pt-40">
		<div class="container mx-auto px-4 sm:px-6 lg:px-8">
			<div class="flex flex-col items-center md:flex-row">
				<div class="md:w-1/2 md:pr-12">
					<h1 class="mb-6 text-4xl font-bold leading-tight md:text-4xl lg:text-5xl">
						Built for <span class="text-[#db324d]">speed</span>. Designed for
						<span class="text-[#db324d]">connection</span>
					</h1>
					<p class="mb-8 text-lg text-gray-600 dark:text-gray-400 md:text-xl">
						Erinias brings your conversations together in a seamless experience. Chat directly or in
						groups with a modern, intuitive interface.
					</p>
					<div class="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
						<a
							href="#"
							class="rounded-lg bg-[#db324d] px-8 py-3 text-center font-medium text-white transition-colors hover:bg-[#c02843]"
						>
							Get Started — It's Free
						</a>
						<a
							href="#features"
							class="rounded-lg border border-gray-300 px-8 py-3 text-center font-medium text-gray-700 transition-colors hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
						>
							Learn More
						</a>
					</div>
					<div class="mt-6 flex items-center text-sm text-gray-500 dark:text-gray-400">
						<span
							class="mr-2 inline-block rounded-full bg-pink-100 px-2 py-1 text-xs font-medium text-[#db324d] dark:bg-pink-900 dark:text-pink-100"
							>BETA</span
						>
						Currently in beta testing. Join now to help shape the future!
					</div>
				</div>
				<div class="mt-12 md:mt-0 md:w-1/2">
					<div class="relative">
						<div
							class="absolute inset-0 rotate-3 scale-105 transform rounded-lg bg-gradient-to-r from-[#db324d] to-[#f04d6a] opacity-20 blur-xl"
						></div>
						<div
							class="relative overflow-hidden rounded-lg border border-gray-200 bg-white shadow-xl dark:border-gray-700 dark:bg-gray-800"
						>
							<div
								class="flex items-center border-b border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900"
							>
								<div class="flex space-x-2">
									<div class="h-3 w-3 rounded-full bg-red-500"></div>
									<div class="h-3 w-3 rounded-full bg-yellow-500"></div>
									<div class="h-3 w-3 rounded-full bg-green-500"></div>
								</div>
								<div class="ml-4 text-sm font-medium text-gray-700 dark:text-gray-300">
									Erinias Chat
								</div>
							</div>
							<div class="flex h-64 flex-col p-4">
								<div class="flex-1 space-y-4 overflow-y-auto">
									<div class="flex items-start">
										<div
											class="h-10 w-10 flex-shrink-0 rounded-full bg-gray-300 dark:bg-gray-700"
										></div>
										<div class="ml-3 max-w-xs rounded-lg bg-gray-100 px-4 py-2 dark:bg-gray-700">
											<p class="text-sm text-gray-900 dark:text-gray-100">
												Hey team! How's the new feature coming along?
											</p>
										</div>
									</div>
									<div class="flex items-start justify-end">
										<div class="max-w-xs rounded-lg bg-[#db324d] px-4 py-2">
											<p class="text-sm text-white">
												Just finished the UI, pushing to staging now!
											</p>
										</div>
										<div
											class="ml-3 h-10 w-10 flex-shrink-0 rounded-full bg-gray-300 dark:bg-gray-700"
										></div>
									</div>
									<div class="flex items-start">
										<div
											class="h-10 w-10 flex-shrink-0 rounded-full bg-gray-300 dark:bg-gray-700"
										></div>
										<div class="ml-3 max-w-xs rounded-lg bg-gray-100 px-4 py-2 dark:bg-gray-700">
											<p class="text-sm text-gray-900 dark:text-gray-100">
												Awesome! Let's review it together.
											</p>
										</div>
									</div>
								</div>
								<div class="mt-4 flex">
									<input
										type="text"
										placeholder="Type a message..."
										class="flex-1 rounded-l-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#db324d] dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
									/>
									<button
										aria-label="Send message"
										class="rounded-r-lg bg-[#db324d] px-4 py-2 text-white"
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											class="h-5 w-5"
											viewBox="0 0 20 20"
											fill="currentColor"
										>
											<path
												d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"
											/>
										</svg>
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</section>

	<!-- Features Section -->
	<section id="features" class="bg-white py-20 dark:bg-gray-900">
		<div class="container mx-auto px-4 sm:px-6 lg:px-8">
			<div class="mb-16 text-center">
				<h2 class="mb-4 text-3xl font-bold md:text-4xl">Designed for modern communication</h2>
				<p class="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-400">
					Erinias provides the tools you need to stay connected with your team, friends, or
					community.
				</p>
			</div>

			<div class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-2">
				<!-- Feature 1 -->
				<div
					class="rounded-xl border border-gray-200 bg-gray-50 p-8 shadow-sm transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
				>
					<div
						class="mb-6 flex h-12 w-12 items-center justify-center rounded-lg bg-pink-100 dark:bg-pink-900"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-6 w-6 text-[#db324d] dark:text-[#f04d6a]"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
							/>
						</svg>
					</div>
					<h3 class="mb-3 text-xl font-bold">Direct Messaging</h3>
					<p class="mb-4 text-gray-600 dark:text-gray-400">
						Connect one-on-one with team members through secure, private conversations. Share files,
						links, and collaborate in real-time.
					</p>
					<ul class="space-y-2 text-gray-600 dark:text-gray-400">
						<li class="flex items-center">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="mr-2 h-5 w-5 text-[#db324d]"
								viewBox="0 0 20 20"
								fill="currentColor"
							>
								<path
									fill-rule="evenodd"
									d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
									clip-rule="evenodd"
								/>
							</svg>
							End-to-end encryption
						</li>
						<li class="flex items-center">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="mr-2 h-5 w-5 text-[#db324d]"
								viewBox="0 0 20 20"
								fill="currentColor"
							>
								<path
									fill-rule="evenodd"
									d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
									clip-rule="evenodd"
								/>
							</svg>
							File sharing
						</li>
						<li class="flex items-center">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="mr-2 h-5 w-5 text-[#db324d]"
								viewBox="0 0 20 20"
								fill="currentColor"
							>
								<path
									fill-rule="evenodd"
									d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
									clip-rule="evenodd"
								/>
							</svg>
							Read receipts
						</li>
					</ul>
				</div>

				<!-- Feature 2 -->
				<div
					class="rounded-xl border border-gray-200 bg-gray-50 p-8 shadow-sm transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
				>
					<div
						class="mb-6 flex h-12 w-12 items-center justify-center rounded-lg bg-pink-100 dark:bg-pink-900"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-6 w-6 text-[#db324d] dark:text-[#f04d6a]"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
							/>
						</svg>
					</div>
					<h3 class="mb-3 text-xl font-bold">Group Chat</h3>
					<p class="mb-4 text-gray-600 dark:text-gray-400">
						Create channels for teams, projects, or topics. Organize conversations and keep everyone
						in the loop with powerful group messaging.
					</p>
					<ul class="space-y-2 text-gray-600 dark:text-gray-400">
						<li class="flex items-center">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="mr-2 h-5 w-5 text-[#db324d]"
								viewBox="0 0 20 20"
								fill="currentColor"
							>
								<path
									fill-rule="evenodd"
									d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
									clip-rule="evenodd"
								/>
							</svg>
							Unlimited members
						</li>
						<li class="flex items-center">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="mr-2 h-5 w-5 text-[#db324d]"
								viewBox="0 0 20 20"
								fill="currentColor"
							>
								<path
									fill-rule="evenodd"
									d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
									clip-rule="evenodd"
								/>
							</svg>
							Thread replies
						</li>
						<li class="flex items-center">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="mr-2 h-5 w-5 text-[#db324d]"
								viewBox="0 0 20 20"
								fill="currentColor"
							>
								<path
									fill-rule="evenodd"
									d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
									clip-rule="evenodd"
								/>
							</svg>
							Role-based permissions
						</li>
					</ul>
				</div>
			</div>

			<div class="mt-16 text-center">
				<div
					class="mb-4 inline-block rounded-full bg-pink-100 px-4 py-2 text-sm font-medium text-[#db324d] dark:bg-pink-900 dark:text-pink-100"
				>
					COMING SOON
				</div>
				<h3 class="mb-2 text-xl font-bold">More features on the way</h3>
				<p class="mx-auto max-w-2xl text-gray-600 dark:text-gray-400">
					We're working on voice channels, screen sharing, and more. Join the beta to get early
					access to new features!
				</p>
			</div>
		</div>
	</section>

	<!-- CTA Section -->
	<section class="bg-gradient-to-r from-[#db324d] to-[#f04d6a] py-20 text-white">
		<div class="container mx-auto px-4 sm:px-6 lg:px-8">
			<div class="mx-auto max-w-3xl text-center">
				<h2 class="mb-6 text-3xl font-bold md:text-4xl">
					Ready to transform how your team communicates?
				</h2>
				<p class="mb-8 text-xl text-pink-100">
					Join thousands of teams already using Erinias to collaborate more effectively.
				</p>
				<div class="flex flex-col justify-center space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
					<a
						href="#"
						class="rounded-lg bg-white px-8 py-3 font-medium text-[#db324d] transition-colors hover:bg-pink-50"
					>
						Sign Up for Free
					</a>
				</div>
				<div class="mt-8 text-sm text-pink-100">
					No credit card required. Free plan available for small teams.
				</div>
			</div>
		</div>
	</section>

	<!-- Footer -->
	<footer class="bg-gray-900 py-12 text-gray-400">
		<div class="container mx-auto px-4 sm:px-6 lg:px-8">
			<div class="grid grid-cols-2 gap-8 md:grid-cols-4">
				<div>
					<h3 class="mb-4 font-bold text-white">Product</h3>
					<ul class="space-y-2">
						<li><a href="#" class="transition-colors hover:text-[#f04d6a]">Features</a></li>
						<li><a href="#" class="transition-colors hover:text-[#f04d6a]">Pricing</a></li>
						<li><a href="#" class="transition-colors hover:text-[#f04d6a]">Roadmap</a></li>
						<li>
							<a href="#" class="flex items-center transition-colors hover:text-[#f04d6a]">
								Beta Program
								<span class="ml-2 rounded-full bg-pink-900 px-2 py-0.5 text-xs text-[#f04d6a]"
									>NEW</span
								>
							</a>
						</li>
					</ul>
				</div>
				<div>
					<h3 class="mb-4 font-bold text-white">Company</h3>
					<ul class="space-y-2">
						<li><a href="#" class="transition-colors hover:text-[#f04d6a]">About</a></li>
						<li><a href="#" class="transition-colors hover:text-[#f04d6a]">Blog</a></li>
						<li><a href="#" class="transition-colors hover:text-[#f04d6a]">Careers</a></li>
						<li><a href="#" class="transition-colors hover:text-[#f04d6a]">Contact</a></li>
					</ul>
				</div>
				<div>
					<h3 class="mb-4 font-bold text-white">Resources</h3>
					<ul class="space-y-2">
						<li><a href="#" class="transition-colors hover:text-[#f04d6a]">Documentation</a></li>
						<li><a href="#" class="transition-colors hover:text-[#f04d6a]">Help Center</a></li>
						<li><a href="#" class="transition-colors hover:text-[#f04d6a]">Community</a></li>
						<li><a href="#" class="transition-colors hover:text-[#f04d6a]">Status</a></li>
					</ul>
				</div>
				<div>
					<h3 class="mb-4 font-bold text-white">Legal</h3>
					<ul class="space-y-2">
						<li><a href="#" class="transition-colors hover:text-[#f04d6a]">Privacy</a></li>
						<li><a href="#" class="transition-colors hover:text-[#f04d6a]">Terms</a></li>
						<li><a href="#" class="transition-colors hover:text-[#f04d6a]">Security</a></li>
					</ul>
				</div>
			</div>

			<div
				class="mt-12 flex flex-col items-center justify-between border-t border-gray-800 pt-8 md:flex-row"
			>
				<div class="flex items-center">
					<span class="text-2xl font-bold text-[#db324d]">Erinias</span>
					<span class="ml-2 rounded-full bg-pink-900 px-2 py-1 text-xs font-medium text-[#f04d6a]"
						>BETA</span
					>
				</div>
				<div class="mt-4 flex space-x-6 md:mt-0">
					<a href="#" class="text-gray-400 transition-colors hover:text-[#f04d6a]">
						<span class="sr-only">Twitter</span>
						<svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
							<path
								d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"
							/>
						</svg>
					</a>
					<a href="#" class="text-gray-400 transition-colors hover:text-[#f04d6a]">
						<span class="sr-only">GitHub</span>
						<svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
							<path
								fill-rule="evenodd"
								d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
								clip-rule="evenodd"
							/>
						</svg>
					</a>
					<a href="#" class="text-gray-400 transition-colors hover:text-[#f04d6a]">
						<span class="sr-only">Discord</span>
						<svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
							<path
								fill-rule="evenodd"
								d="M18.93 5.34a16.89 16.89 0 00-4.07-1.23.06.06 0 00-.07.03c-.18.33-.39.76-.53 1.09a15.72 15.72 0 00-4.52 0c-.14-.34-.35-.76-.54-1.09-.01-.02-.04-.03-.07-.03-1.32.2-2.74.63-4.07 1.23-.01 0-.02.01-.03.02-2.57 3.8-3.28 7.5-2.93 11.17.01.04.03.07.06.08a16.99 16.99 0 005.06 2.52c.03.01.06 0 .07-.02.39-.54.74-1.11 1.04-1.7.02-.04 0-.08-.04-.09-.55-.21-1.08-.47-1.58-.77-.04-.02-.04-.08-.01-.11.11-.08.21-.17.31-.25.02-.02.04-.02.07-.01 3.44 1.57 7.15 1.57 10.55 0 .02-.01.05-.01.07.01.1.09.21.17.32.26.04.03.04.09-.01.11-.5.31-1.03.56-1.59.78-.04.01-.05.06-.04.09.3.59.65 1.16 1.04 1.7.02.02.05.03.08.02a16.91 16.91 0 005.06-2.52c.03-.02.05-.05.06-.08.42-4.27-.7-7.93-2.96-11.18 0-.01-.02-.02-.03-.02zM8.56 14.49c-.94 0-1.72-.87-1.72-1.94s.77-1.94 1.72-1.94c.96 0 1.74.88 1.72 1.94 0 1.07-.77 1.94-1.72 1.94zm6.35 0c-.94 0-1.72-.87-1.72-1.94s.77-1.94 1.72-1.94c.96 0 1.74.88 1.72 1.94 0 1.07-.76 1.94-1.72 1.94z"
								clip-rule="evenodd"
							/>
						</svg>
					</a>
				</div>
			</div>

			<div class="mt-8 text-center text-sm">
				<p>&copy; {new Date().getFullYear()} Erinias. All rights reserved.</p>
			</div>
		</div>
	</footer>
</div>

<style>
	:global(html) {
		scroll-behavior: smooth;
	}
</style>
