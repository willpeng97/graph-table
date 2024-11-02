const ctx = $("#chartCanvas")[0].getContext("2d");
let chart;

// 文档加载完成后执行初始化
$(document).ready(async function () {
	initEventListeners(); // 初始化事件监听
	const chartType = $("#chartType").val();
	const timeRange = $("#timeRange").val();
	await updateChart(chartType, timeRange); // 初始化图表

	// 每分钟刷新图表和表格的数据
	setInterval(async () => {
		const chartType = $("#chartType").val();
		const timeRange = $("#timeRange").val();
		await updateChart(chartType, timeRange);
	}, 10000); // 60000 毫秒 = 1 分钟
});

// 加载 JSON 数据并返回
async function fetchData(timeRange) {
	const response = await fetch("chartData.json");
	const data = await response.json();
	return data[timeRange];
}

// 更新图表的函数
async function updateChart(chartType, timeRange) {
	const rawData = await fetchData(timeRange);
	const labels = rawData.map((item) => item.label);
	const values = rawData.map((item) => item.value);

	if (chart) {
		chart.destroy();
	}

	chart = new Chart(ctx, {
		type: chartType,
		data: {
			labels: labels,
			datasets: [
				{
					label: "数据集",
					data: values,
					backgroundColor: "rgba(75, 192, 192, 0.2)",
					borderColor: "rgba(75, 192, 192, 1)",
					borderWidth: 1,
				},
			],
		},
		options: {
			responsive: true,
			maintainAspectRatio: false,
			scales: {
				y: {
					beginAtZero: true,
				},
			},
			plugins: {
				legend: {
					position: "bottom",
				},
			},
			animation: false, // 停用動畫
		},
	});

	updateTable(labels, values);
}

// 更新表格的函数
function updateTable(labels, values) {
	const tableBody = $("#gridTable tbody");
	tableBody.empty();

	labels.forEach((label, index) => {
		const row = `<tr>
					<td scope="col">${label}</td>
            		<td scope="col">${values[index]}</td>
                </tr>`;
		tableBody.append(row);
	});
}

// 初始化事件监听
function initEventListeners() {
	$("#chartType").on("change", function () {
		const chartType = $(this).val();
		const timeRange = $("#timeRange").val();
		updateChart(chartType, timeRange);
	});

	$("#timeRange").on("change", function () {
		const chartType = $("#chartType").val();
		const timeRange = $(this).val();
		updateChart(chartType, timeRange);
	});
}
