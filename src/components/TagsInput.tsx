import React from 'react'
import { nanoid } from 'nanoid'
import styles from '@/styles/Tags.module.css'
import { useTagStore } from '@/store'

const regExp = new RegExp(/[0-9()+\-*/.]/)

export const TagsInput = () => {
    const tags = useTagStore((state) => state.tags)
    const addTag = useTagStore((state) => state.addTag)
    const updateTag = useTagStore((state) => state.updateTag)
    const deleteTag = useTagStore((state) => state.deleteTag)

	const addHandler = (e: React.KeyboardEvent<HTMLInputElement>) => {
        const input = e.target as HTMLInputElement;
		if (input.value !== '' && regExp.test(input.value)) {
            const newTag = {
                id: nanoid(),
                value: input.value
            }
			addTag(newTag);
			input.value = '';
		}
	};

    const changeHandler = (e: React.ChangeEvent<HTMLInputElement>, idx: number) => {
        e.preventDefault()
        const input = e.target as HTMLInputElement;
        updateTag(idx, input.value)
    }

    const calc = () => {
        if(tags.length > 1) {
            try {
                const tagValues = tags.map(tag => tag.value)
                return eval(tagValues.join(''))
            } catch (err) {
                console.error(err)
            }
        }
    }

    const result = calc();

	return (
        <>
            <div className={styles.tagsBlock}>
                <ul className={styles.tagsList}>
                    {tags.map((tag, idx) => (
                        <li key={tag.id} className={styles.tag}>
                            <input type="text" value={tag.value} className={styles.tagItem} onChange={(e) => changeHandler(e, idx)} />
                            <span className={styles.tagCloseIcon}
                                onClick={() => deleteTag(tag.id)}
                            >
                                x
                            </span>
                        </li>
                    ))}
                </ul>
                <input
                    step='0.01'
                    type='text'
                    placeholder='Press enter'
                    className={styles.tagsInput}
                    onKeyUp={event => event.key === 'Enter' ? addHandler(event) : null}
                />
            </div>
            {result !== (null || undefined) && <h1>Result: {result}</h1>}
        </>
	);
};