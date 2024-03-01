import React, { useEffect, useState } from 'react'
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';

function Login() {
    const navigate = useNavigate()
    const [otp, setOtp] = useState(null);

    const fetchOTP = async () => {
        setOtp(null)
        try {
            const response = await fetch(`http://localhost:3001/otp`, {
                method: 'GET'
            });
            if (response.ok) {
                let data = await response.json()
                setOtp(data['otp'])
                toast.warning('Otp will expire after 1 minute')
                setTimeout(() => setOtp(-1), 1 * 60 * 1000)
            } else {
                toast.error('Error sending otp');
            }
        } catch (error) {
            toast.error('Error sending otp');
        }
    }

    useEffect(() => {
        if (!otp) {
            fetchOTP()
        }
    }, []);

    useEffect(() => {
        document.querySelectorAll('.digit-group input').forEach(function (input) {

            input.addEventListener('paste', (e) => {
                e.preventDefault();

                // Get the pasted text
                const pastedText = (e.clipboardData || window.clipboardData).getData('text');

                // Check if the pasted text is a 6-digit OTP
                if (/^\d{6}$/.test(pastedText)) {
                    // Distribute each digit to its corresponding input field
                    document.querySelectorAll('.digit-group input').forEach((input, index) => {
                        input.value = pastedText[index];
                    });
                }
            });

            input.addEventListener('keyup', function (e) {
                var parent = this.parentElement;

                if (e.keyCode === 8 || e.keyCode === 37) {
                    var prev = parent.querySelector('input#' + this.getAttribute('data-previous'));

                    if (prev) {
                        prev.select();
                    }
                } else if ((e.keyCode >= 48 && e.keyCode <= 57) || e.keyCode === 39) {
                    var next = parent.querySelector('input#' + this.getAttribute('data-next'));

                    if (next) {
                        next.select();
                    } else {
                        var autosubmit = parent.getAttribute('data-autosubmit');
                        if (autosubmit) {
                            document.getElementById('otp').click()
                        }
                    }
                }
            });
        });
    }, [otp])

    const handleLogin = async (e) => {
        e.preventDefault();

        let inputOTP = ''
        document.querySelectorAll('.digit-group input').forEach(function (input) {
            inputOTP += input.value
        })

        if (inputOTP == otp) {
            navigate('home')
        }
        else 
            toast.error('Invalid OTP entered')
    };

    return (
        <div className='login_form'>
            {otp ?
                <>
                {otp === -1 ? 
                    <label>The otp has expired! <Button className='ms-5' onClick={fetchOTP}>Send Again</Button></label>
                :
                <form onSubmit={handleLogin}>
                    <label>Enter the 6 digit OTP sent to your email</label> <br /><br />
                    <div className="mb-3 text-center digit-group" data-autosubmit={true}>
                        <input type="number" min={0} max={9} id="digit-1" name="digit-1" data-next="digit-2" />
                        <input type="number" min={0} max={9} id="digit-2" name="digit-2" data-next="digit-3" data-previous="digit-1" />
                        <input type="number" min={0} max={9} id="digit-3" name="digit-3" data-next="digit-4" data-previous="digit-2" />
                        <span class="splitter">&ndash;</span>
                        <input type="number" min={0} max={9} id="digit-4" name="digit-4" data-next="digit-5" data-previous="digit-3" />
                        <input type="number" min={0} max={9} id="digit-5" name="digit-5" data-next="digit-6" data-previous="digit-4" />
                        <input type="number" min={0} max={9} id="digit-6" name="digit-6" data-previous="digit-5" />
                    </div>
                    <Button onClick={handleLogin} size='large' id='otp' className='px-5' variant="secondary">
                        Login
                    </Button>
                </form>
                }
                </>
                :
                <div>
                    Please wait while we email an OTP ...
                </div>
            }
        </div>
    );
}

export default Login;