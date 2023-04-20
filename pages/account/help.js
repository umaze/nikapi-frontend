import Layout from "@/components/Layout";
import {IconChevronDown} from "@tabler/icons-react";
import {useState} from "react";
import {listQuestionAndAnswer} from "@/config/help";
import styles from "@/styles/Help.module.scss";

export default function HelpPage() {
    const [listExpanded, setListExpanded] = useState([]);

    const handleClick = (number, e) => {
        e.preventDefault();
        const index = listExpanded.findIndex(item => item === number);
        const list = [...listExpanded];
        if (index >= 0) {
            list.splice(index);
        } else {
            list.push(number);
        }
        setListExpanded(list);
    };

    return (
        <Layout title="Hilfe">
            <div className={styles.help}>
                <h1 className="heading-primary">
                    Q&amp;A &ndash; Fragen und Antworten
                </h1>

                <div className={styles.accordion}>
                    {listQuestionAndAnswer && listQuestionAndAnswer.map((item, i) => (
                        <div
                            key={i}
                            className={`${styles.item} ${listExpanded.includes(i) ? styles.open : ''}`}
                            onClick={e => handleClick(i, e)}>
                            <p className={styles.number}>{item.number}</p>
                            <p className={styles.question}>{item.question}</p>
                            <IconChevronDown/>
                            <div className={styles.hiddenBox}>
                                <p>{item.answer}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </Layout>
    );
}
