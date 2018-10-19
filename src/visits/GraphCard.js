import { Card, CardHeader, CardBody } from 'reactstrap';
import { Doughnut, HorizontalBar } from 'react-chartjs-2';
import PropTypes from 'prop-types';
import React from 'react';
import { keys, values } from 'ramda';

const propTypes = {
  title: PropTypes.string,
  isBarChart: PropTypes.bool,
  stats: PropTypes.object,
};

const generateGraphData = (title, isBarChart, stats) => ({
  labels: keys(stats),
  datasets: [
    {
      title,
      data: values(stats),
      backgroundColor: isBarChart ? 'rgba(70, 150, 229, 0.4)' : [
        '#97BBCD',
        '#DCDCDC',
        '#F7464A',
        '#46BFBD',
        '#FDB45C',
        '#949FB1',
        '#4D5360',
      ],
      borderColor: isBarChart ? 'rgba(70, 150, 229, 1)' : 'white',
      borderWidth: 2,
    },
  ],
});

const renderGraph = (title, isBarChart, stats) => {
  const Component = isBarChart ? HorizontalBar : Doughnut;
  const options = {
    legend: isBarChart ? { display: false } : { position: 'right' },
    scales: isBarChart ? {
      xAxes: [
        {
          ticks: { beginAtZero: true },
        },
      ],
    } : null,
  };

  return <Component data={generateGraphData(title, isBarChart, stats)} options={options} />;
};

const GraphCard = ({ title, isBarChart, stats }) => (
  <Card className="mt-4">
    <CardHeader>{title}</CardHeader>
    <CardBody>{renderGraph(title, isBarChart, stats)}</CardBody>
  </Card>
);

GraphCard.propTypes = propTypes;

export default GraphCard;
