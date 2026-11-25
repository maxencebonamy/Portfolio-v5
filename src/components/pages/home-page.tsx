import { AboutSection } from "#/components/sections/about-section"
import { ContactSection } from "#/components/sections/contact-section"
import { HeroSection } from "#/components/sections/hero-section"
import { JourneySection } from "#/components/sections/journey-section"
import { ProjectsSection } from "#/components/sections/projects-section"
import { SkillsSection } from "#/components/sections/skills-section"
import { useI18n } from "#/providers/i18n-provider"
import { PageHead } from "#/seo/page-head"
import { homeMeta } from "#/seo/page-meta"

/** Home page: all sections in order. */
export const HomePage = () => {
	const { lang } = useI18n()

	return (
		<>
			<PageHead meta={homeMeta(lang)} />
			<HeroSection />
			<AboutSection />
			<ProjectsSection />
			<SkillsSection />
			<JourneySection />
			<ContactSection />
		</>
	)
}
