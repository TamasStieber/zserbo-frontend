import PageContainer from "@/components/layout/PageContainer"
import styles from '@/styles/Home.module.css'

const Help = () => {
    const jumpToSection = (id: string) => {
        const section = document.getElementById(id)
        if(section) section.scrollIntoView();
    }

    return (
        <PageContainer title={'Help'}>
            <div className={styles.help_container}>
                <div className={styles.help_toc}>
                    <section className={styles.help_toc_section}>
                        <p className={styles.help_toc_section_title} onClick={e => jumpToSection('getting-started')}>Getting Started</p>
                        <p className={styles.help_toc_section_subtitle} onClick={e => jumpToSection('months')}>Months</p>
                        <p className={styles.help_toc_section_subtitle} onClick={e => jumpToSection('savings')}>Savings</p>
                        <p className={styles.help_toc_section_subtitle} onClick={e => jumpToSection('defaults')}>Defaults</p>
                    </section>
                </div>
                <hr />
                <div className={styles.help_content}>
                    <h1 id="getting-started">Getting Started</h1>
                    <section id="months" className={styles.help_content_section}>
                        <h2>Months</h2>
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloribus ipsa dicta saepe neque unde ducimus corrupti reiciendis repellendus odio fugiat distinctio autem eveniet consequuntur non eum ullam eius dolores voluptatum provident optio, veritatis eaque esse dignissimos rem. Laudantium quisquam delectus maiores a vitae temporibus quibusdam, asperiores, nostrum sequi ut in.</p>
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloribus ipsa dicta saepe neque unde ducimus corrupti reiciendis repellendus odio fugiat distinctio autem eveniet consequuntur non eum ullam eius dolores voluptatum provident optio, veritatis eaque esse dignissimos rem. Laudantium quisquam delectus maiores a vitae temporibus quibusdam, asperiores, nostrum sequi ut in.</p>
                    </section>
                    <section id="savings" className={styles.help_content_section}>
                    <h2>Savings</h2>
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloribus ipsa dicta saepe neque unde ducimus corrupti reiciendis repellendus odio fugiat distinctio autem eveniet consequuntur non eum ullam eius dolores voluptatum provident optio, veritatis eaque esse dignissimos rem. Laudantium quisquam delectus maiores a vitae temporibus quibusdam, asperiores, nostrum sequi ut in.</p>
                    </section>
                    <section id="defaults" className={styles.help_content_section}>
                    <h2>Defaults</h2>
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloribus ipsa dicta saepe neque unde ducimus corrupti reiciendis repellendus odio fugiat distinctio autem eveniet consequuntur non eum ullam eius dolores voluptatum provident optio, veritatis eaque esse dignissimos rem. Laudantium quisquam delectus maiores a vitae temporibus quibusdam, asperiores, nostrum sequi ut in.</p>
                    </section>
                </div>
            </div>
        </PageContainer>
    )
}

export default Help