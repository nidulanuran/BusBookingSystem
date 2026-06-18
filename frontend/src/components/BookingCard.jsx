import { useState } from "react"

function BookingCard(){

   const [selectedSeats,setSelectedSeats]=useState([])
   const [seatCount, setSeatCount] = useState(1)
   const [error,setError]=useState(null)

   function handleSeatClick(seat){

    if(seatCount<6 || selectedSeats.includes(seat)){
        setSelectedSeats(prevSeats=>{

            const updatedSeats=selectedSeats.includes(seat)
            ? selectedSeats.filter((s)=> s !== seat)
            : [...prevSeats,seat]
            setSeatCount(updatedSeats.length)
            setError("")
            return updatedSeats
        
        })
    }
    else{
        setError("you can select 6 seats only ")
    }
        
       
    }

    function errorHandler(err){
        setError(err)
    }

    return(
<div className="seating-body">
    <div className="seating-container">
        <div className="leftseatsLayout">

            <div >
                <button
                    className={`seats ${selectedSeats.includes(1) ? "selected" : ""}
                                        ${seatCount >=6 && !selectedSeats.includes(1) ? "disabled" : ""}`}
                    onClick={() => handleSeatClick(1)}
                >01</button>

                <button
                    className={`seats ${selectedSeats.includes(2) ? "selected" : ""}
                                    ${seatCount >=6 && !selectedSeats.includes(2) ? "disabled" : ""}`}
                    onClick={() => handleSeatClick(2)}
                >02</button>
            </div>

            <div >
                <button
                    className={`seats ${selectedSeats.includes(5) ? "selected" : ""}
                                    ${seatCount >=6 && !selectedSeats.includes(5) ? "disabled" : ""}`}
                    onClick={() => handleSeatClick(5)}
                >05</button>

                <button
                    className={`seats ${selectedSeats.includes(6) ? "selected" : ""}
                                    ${seatCount >=6 && !selectedSeats.includes(6) ? "disabled" : ""}`}
                    onClick={() => handleSeatClick(6)}
                >06</button>
            </div>

            <div >
                <button
                    className={`seats ${selectedSeats.includes(9) ? "selected" : ""}
                                    ${seatCount >=6 && !selectedSeats.includes(9) ? "disabled" : ""}`}
                    onClick={() => handleSeatClick(9)}
                >09</button>

                <button
                    className={`seats ${selectedSeats.includes(10) ? "selected" : ""}
                                    ${seatCount >=6 && !selectedSeats.includes(10) ? "disabled" : ""}`}
                    onClick={() => handleSeatClick(10)}
                >10</button>
            </div>

            <div >
                <button
                    className={`seats ${selectedSeats.includes(13) ? "selected" : ""}
                                    ${seatCount >=6 && !selectedSeats.includes(13) ? "disabled" : ""}`}
                    onClick={() => handleSeatClick(13)}
                >13</button>

                <button
                    className={`seats ${selectedSeats.includes(14) ? "selected" : ""}
                            ${seatCount >=6 && !selectedSeats.includes(14) ? "disabled" : ""}`}
                    onClick={() => handleSeatClick(14)}
                >14</button>
            </div>

            <div >
                <button
                    className={`seats ${selectedSeats.includes(17) ? "selected" : ""}
                            ${seatCount >=6 && !selectedSeats.includes(17) ? "disabled" : ""}`}
                    onClick={() => handleSeatClick(17)}
                >17</button>

                <button
                    className={`seats ${selectedSeats.includes(18) ? "selected" : ""}
                            ${seatCount >=6 && !selectedSeats.includes(18) ? "disabled" : ""}`}
                    onClick={() => handleSeatClick(18)}
                >18</button>
            </div>

            <div >
                <button
                    className={`seats ${selectedSeats.includes(21) ? "selected" : ""}
                            ${seatCount >=6 && !selectedSeats.includes(21) ? "disabled" : ""}`}
                    onClick={() => handleSeatClick(21)}
                >21</button>

                <button
                    className={`seats ${selectedSeats.includes(22) ? "selected" : ""}
                            ${seatCount >=6 && !selectedSeats.includes(22) ? "disabled" : ""}`}
                    onClick={() => handleSeatClick(22)}
                >22</button>
            </div>

            <div >
                <button
                    className={`seats ${selectedSeats.includes(25) ? "selected" : ""}
                            ${seatCount >=6 && !selectedSeats.includes(25) ? "disabled" : ""}`}
                    onClick={() => handleSeatClick(25)}
                >25</button>

                <button
                    className={`seats ${selectedSeats.includes(26) ? "selected" : ""}
                            ${seatCount >=6 && !selectedSeats.includes(26) ? "disabled" : ""}`}
                    onClick={() => handleSeatClick(26)}
                >26</button>
            </div>

            <div >
                <button
                    className={`seats ${selectedSeats.includes(29) ? "selected" : ""}
                            ${seatCount >=6 && !selectedSeats.includes(29) ? "disabled" : ""}`}
                    onClick={() => handleSeatClick(29)}
                >29</button>

                <button
                    className={`seats ${selectedSeats.includes(30) ? "selected" : ""}
                            ${seatCount >=6 && !selectedSeats.includes(30) ? "disabled" : ""}`}
                    onClick={() => handleSeatClick(30)}
                >30</button>
            </div>

            <div >
                <button
                    className={`seats ${selectedSeats.includes(33) ? "selected" : ""}
                            ${seatCount >=6 && !selectedSeats.includes(33) ? "disabled" : ""}`}
                    onClick={() => handleSeatClick(33)}
                >33</button>

                <button
                    className={`seats ${selectedSeats.includes(34) ? "selected" : ""}
                            ${seatCount >=6 && !selectedSeats.includes(34) ? "disabled" : ""}`}
                    onClick={() => handleSeatClick(34)}
                >34</button>
            </div>

            <div >
                <button
                    className={`seats ${selectedSeats.includes(37) ? "selected" : ""}
                            ${seatCount >=6 && !selectedSeats.includes(37) ? "disabled" : ""}`}
                    onClick={() => handleSeatClick(37)}
                >37</button>

                <button
                    className={`seats ${selectedSeats.includes(38) ? "selected" : ""}
                            ${seatCount >=6 && !selectedSeats.includes(38) ? "disabled" : ""}`}
                    onClick={() => handleSeatClick(38)}
                >38</button>
            </div>

            <div >
                <button
                    className={`seats ${selectedSeats.includes(41) ? "selected" : ""}
                            ${seatCount >=6 && !selectedSeats.includes(41) ? "disabled" : ""}`}
                    onClick={() => handleSeatClick(41)}
                >41</button>

                <button
                    className={`seats ${selectedSeats.includes(42) ? "selected" : ""}
                            ${seatCount >=6 && !selectedSeats.includes(42) ? "disabled" : ""}`}
                    onClick={() => handleSeatClick(42)}
                >42</button>
            </div>

            <div >
                <button
                    className={`seats ${selectedSeats.includes(45) ? "selected" : ""}
                            ${seatCount >=6 && !selectedSeats.includes(45) ? "disabled" : ""}`}
                    onClick={() => handleSeatClick(45)}
                >45</button>

                <button
                    className={`seats ${selectedSeats.includes(46) ? "selected" : ""}
                            ${seatCount >=6 && !selectedSeats.includes(46) ? "disabled" : ""}`}
                    onClick={() => handleSeatClick(46)}
                >46</button>
            </div>


        </div>

        <div className="backseatsLayout">

            <div >
                <button
                    className={`seats ${selectedSeats.includes(47) ? "selected" : ""}
                            ${seatCount >=6 && !selectedSeats.includes(47) ? "disabled" : ""}`}
                    onClick={() => handleSeatClick(47)}
                >47</button>

                <button
                    className={`seats ${selectedSeats.includes(48) ? "selected" : ""}
                            ${seatCount >=6 && !selectedSeats.includes(48) ? "disabled" : ""}`}
                    onClick={() => handleSeatClick(48)}
                >48</button>
            </div>

        </div>

        <div className="rightseatsLayout">

            <div >
                <button
                    className={`seats ${selectedSeats.includes(3) ? "selected" : ""}
                            ${seatCount >=6 && !selectedSeats.includes(3) ? "disabled" : ""}`}
                    onClick={() => handleSeatClick(3)}
                >03</button>

                <button
                    className={`seats ${selectedSeats.includes(4) ? "selected" : ""}
                            ${seatCount >=6 && !selectedSeats.includes(4) ? "disabled" : ""}`}
                    onClick={() => handleSeatClick(4)}
                >04</button>
            </div>

            <div >
                <button
                    className={`seats ${selectedSeats.includes(7) ? "selected" : ""}
                            ${seatCount >=6 && !selectedSeats.includes(7) ? "disabled" : ""}`}
                    onClick={() => handleSeatClick(7)}
                >07</button>

                <button
                    className={`seats ${selectedSeats.includes(8) ? "selected" : ""}
                            ${seatCount >=6 && !selectedSeats.includes(8) ? "disabled" : ""}`}
                    onClick={() => handleSeatClick(8)}
                >08</button>
            </div>

            <div >
                <button
                    className={`seats ${selectedSeats.includes(11) ? "selected" : ""}
                            ${seatCount >=6 && !selectedSeats.includes(11) ? "disabled" : ""}`}
                    onClick={() => handleSeatClick(11)}
                >11</button>

                <button
                    className={`seats ${selectedSeats.includes(12) ? "selected" : ""}
                            ${seatCount >=6 && !selectedSeats.includes(12) ? "disabled" : ""}`}
                    onClick={() => handleSeatClick(12)}
                >12</button>
            </div>

            <div >
                <button
                    className={`seats ${selectedSeats.includes(15) ? "selected" : ""}
                            ${seatCount >=6 && !selectedSeats.includes(15) ? "disabled" : ""}`}
                    onClick={() => handleSeatClick(15)}
                >15</button>

                <button
                    className={`seats ${selectedSeats.includes(16) ? "selected" : ""}
                            ${seatCount >=6 && !selectedSeats.includes(16) ? "disabled" : ""}`}
                    onClick={() => handleSeatClick(16)}
                >16</button>
            </div>

            <div >
                <button
                    className={`seats ${selectedSeats.includes(19) ? "selected" : ""}
                            ${seatCount >=6 && !selectedSeats.includes(19) ? "disabled" : ""}`}
                    onClick={() => handleSeatClick(19)}
                >19</button>

                <button
                    className={`seats ${selectedSeats.includes(20) ? "selected" : ""}
                            ${seatCount >=6 && !selectedSeats.includes(20) ? "disabled" : ""}`}
                    onClick={() => handleSeatClick(20)}
                >20</button>
            </div>

            <div >
                <button
                    className={`seats ${selectedSeats.includes(23) ? "selected" : ""}
                            ${seatCount >=6 && !selectedSeats.includes(23) ? "disabled" : ""}`}
                    onClick={() => handleSeatClick(23)}
                >23</button>

                <button
                    className={`seats ${selectedSeats.includes(24) ? "selected" : ""}
                            ${seatCount >=6 && !selectedSeats.includes(24) ? "disabled" : ""}`}
                    onClick={() => handleSeatClick(24)}
                >24</button>
            </div>

            <div >
                <button
                    className={`seats ${selectedSeats.includes(27) ? "selected" : ""}
                            ${seatCount >=6 && !selectedSeats.includes(27) ? "disabled" : ""}`}
                    onClick={() => handleSeatClick(27)}
                >27</button>

                <button
                    className={`seats ${selectedSeats.includes(28) ? "selected" : ""}
                            ${seatCount >=6 && !selectedSeats.includes(28) ? "disabled" : ""}`}
                    onClick={() => handleSeatClick(28)}
                >28</button>
            </div>

            <div >
                <button
                    className={`seats ${selectedSeats.includes(31) ? "selected" : ""}
                            ${seatCount >=6 && !selectedSeats.includes(31) ? "disabled" : ""}`}
                    onClick={() => handleSeatClick(31)}
                >31</button>

                <button
                    className={`seats ${selectedSeats.includes(32) ? "selected" : ""}
                            ${seatCount >=6 && !selectedSeats.includes(32) ? "disabled" : ""}`}
                    onClick={() => handleSeatClick(32)}
                >32</button>
            </div>

            <div >
                <button
                    className={`seats ${selectedSeats.includes(35) ? "selected" : ""}
                            ${seatCount >=6 && !selectedSeats.includes(35) ? "disabled" : ""}`}
                    onClick={() => handleSeatClick(35)}
                >35</button>

                <button
                    className={`seats ${selectedSeats.includes(36) ? "selected" : ""}
                            ${seatCount >=6 && !selectedSeats.includes(36) ? "disabled" : ""}`}
                    onClick={() => handleSeatClick(36)}
                >36</button>
            </div>

            <div >
                <button
                    className={`seats ${selectedSeats.includes(39) ? "selected" : ""}
                            ${seatCount >=6 && !selectedSeats.includes(39) ? "disabled" : ""}`}
                    onClick={() => handleSeatClick(39)}
                >39</button>

                <button
                    className={`seats ${selectedSeats.includes(40) ? "selected" : ""}
                            ${seatCount >=6 && !selectedSeats.includes(40) ? "disabled" : ""}`}
                    onClick={() => handleSeatClick(40)}
                >40</button>
            </div>

            <div >
                <button
                    className={`seats ${selectedSeats.includes(43) ? "selected" : ""}
                            ${seatCount >=6 && !selectedSeats.includes(43) ? "disabled" : ""}`}
                    onClick={() => handleSeatClick(43)}
                >43</button>

                <button
                    className={`seats ${selectedSeats.includes(44) ? "selected" : ""}
                            ${seatCount >=6 && !selectedSeats.includes(44) ? "disabled" : ""}`}
                    onClick={() => handleSeatClick(44)}
                >44</button>
            </div>

            <div >
                <button
                    className={`seats ${selectedSeats.includes(49) ? "selected" : ""}
                            ${seatCount >=6 && !selectedSeats.includes(49) ? "disabled" : ""}`}
                    onClick={() => handleSeatClick(49)}
                >49</button>

                <button
                    className={`seats ${selectedSeats.includes(50) ? "selected" : ""}
                            ${seatCount >=6 && !selectedSeats.includes(50) ? "disabled" : ""}`}
                    onClick={() => handleSeatClick(50)}
                >50</button>
            </div>

        </div> 
        
    </div>
    <p className="error">{error}</p>
</div>)

}
export default BookingCard