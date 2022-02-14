import React,{useState, useEffect} from 'react'
import '../App.css';
import axios from 'axios'
import Modal from 'react-modal'

export default function Recipe() {

    const [byName, setByName] = useState('')
    const [mealName, setMealName] = useState('')
    const [mealNameResults, setMealNameResults] = useState("")
    const [filterBy, setFilterBy] = useState("")
    const [checked, setChecked] = useState(false)
    const [displayInstructions, setDisplayInstructions] = useState("")
    const [modalIsOpen, setModalIsOpen] = useState(false)
    useEffect(() => {
        
        const getMealPlan = async () => {
            setMealName("")
            try {
                if(checked === false){
                    const response = await axios.get(`https://themealdb.com/api/json/v1/1/search.php?s=${byName}`)
                    setMealNameResults(response.data)
                }else{
                    const ingredientResponse = await axios.get(`https://themealdb.com/api/json/v1/1/filter.php?i=${filterBy}`)
                    setMealNameResults(ingredientResponse.data)
                }
            } catch (error) {
                console.log(`error error ${error}`)
            }
        }
        getMealPlan()
    },[byName, filterBy])

     const handleTab = (a, strInstructions) => {
        setModalIsOpen(a)
        setDisplayInstructions(strInstructions)
        // console.log(`instructions ${instructions}`)
        // window.open(instructions, '_blank');
    }
  return (
    <div >
        <div className='search'>
            { checked ?
            <h1>Filter food by ingredient</h1>
            :
            <h1>Search for food</h1>
            }
            <input 
                className='find'
                type="text"
                name='box'
                style={{height:40, width: 250, fontSize: 25, fontWeight: 'bold'}}
                value={mealName}
                placeholder={checked ? "Filter" : "Search"}
                onChange={(e) => setMealName(e.target.value)}
                />
            <br/>
            <input
                className='find'
                name="searchOrFilter"
                type="checkbox"
                checked={checked}
                onChange={(e) => setChecked(e.target.checked)} 
                />
                <label> Check box to filter</label>
            <br/>
            <button 
                style={{width: 90,
                    height: 30,}}
                onClick={() => checked ? setFilterBy(mealName) : setByName(mealName)}
                disabled={mealName.length < 1 || mealName.length > 30}
            >
                Get meal
            </button>            
        </div>
        {/* <h1>{loading ? <p>loading...</p> : ""}</h1>
        <h1>{isError ? <p>Sorry, there was an error</p> : ""}</h1> */}
       {mealNameResults["meals"] == null ? "No results found" :
         
        <table >
            <tbody className='mealThumb' >
            { mealNameResults["meals"]?.map(meal => ( 
                <tr  key={meal.idMeal}>
                    <td > 
                       <img 
                            width='225px'
                            src={meal.strMealThumb}
                            alt="food"
                        />
                        <br/>
                        <a href="#" onClick={() => handleTab(true, meal?.strInstructions)}>{meal.strMeal}</a>
                    </td>
                    {/* <td>
                        <a href="#" onClick={() => handleTab(true, meal?.strInstructions)}>{meal.strMeal}</a>
                    </td> */}
    <Modal 
        isOpen={modalIsOpen} 
        ariaHideApp={false}
    >
        {displayInstructions} <br/>
        <button onClick={() => setModalIsOpen(false)}>Close</button>
    </Modal>
                </tr>
                ))}
            </tbody>
        </table>
    }
    </div>
  )
}
