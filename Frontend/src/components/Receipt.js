import html2pdf from 'html2pdf.js';

const Receipt = () => {
    const info = {
        name: 'Mohammad Muneeb Arshad',
        phone: '0332982389',
        email: 'muneebarshad2002@gmail.com',
        date: '20/06/2024',
        amount: '2000',
        quantity: 100,
        carname: 'Wagon R',
        regNo: 'LEA-1604',
        current: 2000,
        next: 3000,
        oil: 'Euro'
    };

    const handleDownload = async () => {
        const pdfElement = document.getElementById('receipt');

        if (!pdfElement) {
            console.error('PDF element not found.');
            return;
        }

        const options = {
            margin: 0,
            filename: 'receipt.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'mm', format: 'a5', orientation: 'portrait' },
        };

        html2pdf().from(pdfElement).set(options).save();
    };

    return (
        <>
            <i onClick={handleDownload} className="fa-solid fa-download"></i>

            <div id="receipt" className='py-3 px-2'>

                <center id="top" className='my-5'>
                    <div className="info">
                        <h2>Car Oil Sales</h2>
                    </div>
                </center>
                <br></br>

                <div id='mid'>
                    <p><strong>Date: </strong><span>{info.date}</span></p>
                    <p><strong>Name: </strong><span>{info.name}</span></p>
                    <p><strong>Phone: </strong><span>{info.phone}</span></p>
                    <p><strong>Email: </strong><span>{info.email}</span></p>
                <br/>
                </div>

                <div id="bot">
                    <div id="table">
                        <div>
                            <p>Oil</p>
                            <p>{info.oil}</p>
                        </div>
                        <div>
                            <p>Quantity bought</p>
                            <p>{info.quantity} litres</p>
                        </div>
                        <div>
                            <p>Car Name</p>
                            <p>{info.carname}</p>
                        </div>
                        <div>
                            <p>Registration No</p>
                            <p>{info.regNo}</p>
                        </div>
                        <div>
                            <p>Current Mileage</p>
                            <p>{info.current}</p>
                        </div>
                        <div>
                            <p>Mileage at next oil change</p>
                            <p>{info.next}</p>
                        </div>
                        <br></br><br />
                        <div className="tabletitle">
                            <h2 >Total Amount</h2>
                            <h2>Rs. {info.amount}</h2>
                        </div>
                    </div>
                    <br></br>
                    <br></br>
                    <p className='end'>Thank you for using our Car Oil Sales Platform!</p>
                </div>
            </div>

        </>
    );
}

export default Receipt;
