import './UserCard.css';

function UserCard(props)
{
    return (
        <div className='usercrd'>
            <h3>{props.name}</h3>
            <p>{props.role}</p>
            {/* Condition */}
            <span>
                Status : {props.is_available ? 
                       <span className="available">  <i class="bi bi-circle-fill"></i>Available</span> 
                       :
                       <span className="not-available">  <i class="bi bi-circle-fill"></i>Not Available</span>    
            }
            </span>
        </div>
    );
}

export default UserCard;