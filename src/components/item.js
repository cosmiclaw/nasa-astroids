import * as React from "react";

function Item({
  isLiked,
  onLike,
  id,
  name,
  absMagnitudeHeight,
  diameter,
  likeData,
  closeApproachData,
  velocityIn,
  missDistanceIn,
  onClick,
}) {
  const data = [];
  closeApproachData?.forEach((_item) => {
    const item = {
      id,
      name,
      absMagnitudeHeight,
      diameter,
      closeDate: _item.close_approach_date,
      orbBody: _item.orbiting_body,
      velocity: _item.relative_velocity[velocityIn],
      distance: _item.miss_distance[missDistanceIn],
    };

    data.push(item);
  });

  if (!closeApproachData)
    return (
      <tr>
        <td>{id}</td>
        <td>{name}</td>
        <td onClick={() => onLike(likeData)}>
          {isLiked ? (
            <i className="fa-solid fa-heart icon"></i>
          ) : (
            <i className="fa-regular fa-heart icon"></i>
          )}
        </td>
      </tr>
    );

  return data.map((item) => (
    <tr>
      <td onClick={() => onClick(item.id)}>{item.id}</td>
      <td onClick={() => onClick(item.id)}>{item.name}</td>
      {item.absMagnitudeHeight && (
        <td onClick={() => onClick(item.id)}>{item.absMagnitudeHeight}</td>
      )}
      {item.diameter && (
        <td onClick={() => onClick(item.id)}>
          <div>Min: {item.diameter?.estimated_diameter_min}</div>
          <div>Max: {item.diameter?.estimated_diameter_max}</div>
        </td>
      )}
      {closeApproachData && (
        <td onClick={() => onClick(item.id)}>{item.closeDate}</td>
      )}
      {item.velocity && (
        <td onClick={() => onClick(item.id)}>{item.velocity}</td>
      )}
      {item.distance && (
        <td onClick={() => onClick(item.id)}>{item.distance}</td>
      )}
      {closeApproachData && (
        <td onClick={() => onClick(item.id)}>{item.orbBody}</td>
      )}
      <td onClick={() => onLike(likeData)}>
        {isLiked ? (
          <i className="fa-solid fa-heart icon"></i>
        ) : (
          <i className="fa-regular fa-heart icon"></i>
        )}
      </td>
    </tr>
  ));
}

export default Item;
