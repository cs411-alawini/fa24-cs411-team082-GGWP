import React from "react";
import { Recreation } from "../../services/services";
import { Link } from "react-router-dom";

interface RecListProps {
    recData: Recreation[];
}

const RecList: React.FC<RecListProps> = ({ recData }) => {
    return (
        <ul className="divide-y divide-gray">
            {recData.map((rec) => (
                <li key={rec.RecName} className="flex py-4">
                    <div className="ml-3 py-5">
                        <p className="text-xl font-medium text-gray-900">
                            {rec.RecName}
                        </p>
                    <p className="text-xl text-gray-500">
                        {rec.RecType}, {rec.StateName}
                    </p>
                    </div>
                    <div className="ml-auto py-8">
                        <Link className="text-blue hover:text-gray flex items-center" to={`/searchRecreation/${rec.RecName}`}>
                            Details
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 ml-1"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 5l7 7-7 7"
                                />
                            </svg>
                        </Link>
                    </div>
                </li>
            ))}
        </ul>
    );
};



export default RecList;