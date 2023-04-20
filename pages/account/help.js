import Layout from "@/components/Layout";
import {IconChevronDown, IconChevronUp} from "@tabler/icons-react";
import {useState} from "react";
import {listQuestionAndAnswer} from "@/config/help";
import _ from "lodash";
import styles from "@/styles/Help.module.scss";

export default function HelpPage() {
    const [listExpanded, setListExpanded] = useState([]);

    const handleClick = (indTopic, indItem, e) => {
        e.preventDefault();
        const index = listExpanded[indTopic]?.findIndex(item => item === indItem);
        const listTopic = _.cloneDeep(listExpanded[indTopic]) || [];
        if (index >= 0) {
            listTopic.splice(index);
        } else {
            listTopic.push(indItem);
        }
        const listAll = _.cloneDeep(listExpanded);
        listAll[indTopic] = listTopic;
        setListExpanded(listAll);
    };

    const isCollapsable = (indTopic, indItem) => {
        return listExpanded[indTopic]?.includes(indItem);
    };

    return (
        <Layout title="Hilfe">
            <div className={styles.help}>
                <h1 className="heading-primary">
                    Q&amp;A &ndash; Fragen und Antworten
                </h1>

                {listQuestionAndAnswer && listQuestionAndAnswer.map((item, i) => (
                    <div key={i} className={styles.topic}>
                        <h2 className="heading-secondary">{item.topic.name}</h2>
                        <div className={styles.accordion}>
                        {item.topic.list && item.topic.list.map((item, ind) => (
                            <div
                                key={ind}
                                className={`${styles.item} ${isCollapsable(i, ind) ? styles.open : ''}`}
                                onClick={e => handleClick(i, ind, e)}>
                                <p className={styles.number}>{item.number}</p>
                                <p className={styles.question}>{item.question}</p>
                                {isCollapsable(i, ind) ? <IconChevronUp/> : <IconChevronDown/>}
                                <div className={styles.hiddenBox}>
                                    <p>{item.answer}</p>
                                </div>
                            </div>
                        ))}
                        </div>
                    </div>
                ))}
            </div>
        </Layout>
    );
}
