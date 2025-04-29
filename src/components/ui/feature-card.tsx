export function FeatureCard({
	title,
	description,
}: {
	title: string;
	description: string;
}) {
	return (
		<div className="flex flex-col gap-2 bg-red-100 w-full rounded-md h-64 p-4">
			<div className="w-full flex-grow bg-yellow-100"></div>
			<p className="font-bold">{title}</p>
			<p className="text-black/60 text-sm">{description}</p>
		</div>
	);
}
