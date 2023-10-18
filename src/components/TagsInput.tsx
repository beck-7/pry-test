import React, { useState } from 'react'
import { nanoid } from 'nanoid'
import { useQuery } from '@tanstack/react-query'
import { useTagStore } from '@/store'
import styles from '@/styles/Tags.module.css'

export const TagsInput = () => {
    const [inputValue, setInputValue] = useState("");
    const [filteredData, setFilteredData] = useState<ISelectData[]>([]);
    const [isDropdownOpen, setIsDopDownOpen] = useState(false);

    const tags = useTagStore((state) => state.tags)
    const addTag = useTagStore((state) => state.addTag)
    const updateTag = useTagStore((state) => state.updateTag)
    const deleteTag = useTagStore((state) => state.deleteTag)
    const fetchData = useTagStore((state) => state.fetchData)
    const selectData = useTagStore((state) => state.selectData)

    const { isLoading } = useQuery({
        queryKey: ['data'],
        queryFn: fetchData,
      })

    const searchHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        const input = e.target as HTMLInputElement;
        setInputValue(input.value);
        
        if (tags.length !== 0 &&
          input.value === "+" ||
          input.value === "-" ||
          input.value === "*" ||
          input.value === "/" ||
          input.value === "(" ||
          input.value === ")"
        ) {
          const newTag = {
            id: nanoid(),
            name: input.value,
            value: input.value,
          }

          addTag(newTag);
          setInputValue("");
        }
          let filteredItems:ISelectData[];
    
          if (!input.value.trim().length) {
            filteredItems = [...selectData];
          } else {
            filteredItems = selectData.filter((item) => {
              return item.name.toLowerCase().startsWith(input.value.toLowerCase());
            });
          }
    
          setFilteredData(filteredItems);
          if (filteredItems.length === 0) {
            setIsDopDownOpen(false);
          } else {
            setIsDopDownOpen(true);
          }
      };
      
	const addHandler = (item: ISelectData) => {
        const newTag = {
            id: item.id,
            name: item.name,
            value: item.value.toString()
        }
        addTag(newTag);
        setInputValue('');
        setFilteredData([])
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

    if(isLoading) return <div>Loading...</div>

	return (
        <>
            <div className={styles.tagsBlock}>
                <ul className={styles.tagsList}>
                    {tags?.map((tag, idx) => (
                        <li key={tag.id} className={styles.tag}>
                            <input type="text" value={tag.name} className={styles.tagItem} onChange={(e) => changeHandler(e, idx)} />
                            <span className={styles.tagCloseIcon}
                                onClick={() => deleteTag(tag.id)}
                            >
                                x
                            </span>
                        </li>
                    ))}
                </ul>
                <input
                    value={inputValue}
                    onChange={searchHandler}
                    placeholder='Press enter'
                    className={styles.tagsInput}
              />
            </div>
            {isDropdownOpen && 
                <ul>
                    {filteredData?.map((item) => (
                        <li key={item.id} className={styles.dropdownItem} onClick={()=> addHandler(item)}>{item.name}</li>
                    ))}
                </ul>
            }
            {result !== (null || undefined) && <h1>Result: {result}</h1>}
        </>
	);
};