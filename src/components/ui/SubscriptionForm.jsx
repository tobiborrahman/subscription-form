'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { QRCodeCanvas } from 'qrcode.react';
import parsePhoneNumberFromString from 'libphonenumber-js';

const countries = [
	{ code: 'BD', name: 'Bangladesh' },
	{ code: 'GB', name: 'United Kingdom' },
	{ code: 'US', name: 'United States' },
	{ code: 'CA', name: 'Canada' },
	{ code: 'PK', name: 'Pakistan' },
];

const SubscriptionForm = () => {
	const [phone, setPhone] = useState('');
	const [country, setCountry] = useState('BD');
	const [qrData, setQrData] = useState('');
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');

	useEffect(() => {
		setError('');
		setQrData('');
	}, [country]);

	const validatePhoneNumber = (number, countryCode) => {
		const cleanedNumber = number.replace(/[^\d+]/g, '');
		if (number !== cleanedNumber)
			return 'Phone number must contain only numbers.';

		const phoneNumber = parsePhoneNumberFromString(number, countryCode);

		if (!phoneNumber) return 'Invalid phone number format.';
		if (!phoneNumber.isValid()) return 'Phone number is not valid.';

		return '';
	};

	const handlePhoneChange = (e) => {
		const inputNumber = e.target.value;
		setPhone(inputNumber);

		const validationMessage = validatePhoneNumber(inputNumber, country);
		setError(validationMessage);
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		const validationMessage = validatePhoneNumber(phone, country);

		if (validationMessage) {
			setError(validationMessage);
			return;
		}

		setLoading(true);
		setTimeout(() => {
			setQrData(
				parsePhoneNumberFromString(
					phone,
					country
				)?.formatInternational()
			);
			setLoading(false);
		}, 2000);
	};

	return (
		<div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
			<Card className="max-w-md w-full p-6 shadow-lg">
				<CardContent>
					<h2 className="text-xl font-semibold text-center mb-4">
						Subscribe with your Phone
					</h2>
					<form onSubmit={handleSubmit} className="space-y-4">
						<select
							value={country}
							onChange={(e) => {
								setCountry(e.target.value);
								setError('');
							}}
						>
							{countries.map((c) => (
								<option key={c.code} value={c.code}>
									{c.name}
								</option>
							))}
						</select>
						<Input
							type="tel"
							placeholder="Enter your phone number"
							value={phone}
							onChange={handlePhoneChange}
							className="border border-gray-300 p-2 rounded-md w-full"
						/>
						{error && (
							<p className="text-red-500 text-sm">{error}</p>
						)}
						<Button
							type="submit"
							disabled={loading}
							className="w-full cursor-pointer"
						>
							{loading ? 'Generating QR...' : 'Get QR Code'}
						</Button>
					</form>

					{qrData && (
						<div className="mt-6 flex flex-col items-center">
							<p className="mb-2 text-gray-600">
								Scan this QR to confirm:
							</p>
							<QRCodeCanvas value={qrData} size={150} />
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
};

export default SubscriptionForm;
